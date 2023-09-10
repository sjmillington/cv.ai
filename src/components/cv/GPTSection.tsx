import { DOMAttributes, FocusEventHandler, forwardRef, useEffect, useRef, useState } from "react"
import Textarea from "../form/Textarea"
import { api } from "~/utils/api"

interface GPTSectionProps {
    onSaveState: (prompt: string | undefined, result: string | undefined) => void
}

export default function GPTSection({ onSaveState }: GPTSectionProps) {

    const [ section, setSection ] = useState('')
    const promptRef = useRef<HTMLTextAreaElement>(null)

    const { data, isLoading } = api.user.current.useQuery()
    const { mutate: runGPT, isLoading: gptLoading } = api.user.generateGPT.useMutation({
        async onSuccess(data: string) {
            setSection(data)
            onSaveState(undefined, data)
        }
    })
    
    useEffect(() => {
        setSection(data?.personal?.result ?? '')
    }, [data])

    if(isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Textarea label='Prompt' 
                      defaultValue={data?.personal?.prompt} 
                      onBlur={e => onSaveState(e.currentTarget.value, undefined)} 
                      ref={promptRef}
                    />
            <button className="btn btn-primary float-right mt-4"
                     onClick={() => void runGPT({ data:{ prompt: promptRef?.current?.value ?? ''}})}
                     >
                        { gptLoading && <span className="loading loading-spinner"></span>}
                        Generate
            </button>
            <Textarea label='Generated' 
                        value={section} 
                        onChange={(e) => setSection(e.target.value)} 
                        onBlur={(e) => onSaveState(undefined, e.currentTarget.value)}
                    />
        </>
    )
}
