import { DOMAttributes, FocusEventHandler, forwardRef, useEffect, useRef, useState } from "react"
import Textarea from "../form/Textarea"
import { api } from "~/utils/api"

interface GPTSectionProps {
    onPromptBlur: FocusEventHandler<HTMLTextAreaElement>
}

export default function GPTSection({ onPromptBlur }: GPTSectionProps) {

    const [ section, setSection ] = useState('')

    const { data, isLoading } = api.user.current.useQuery()

    const mutation = api.user.personalSection.useMutation({
        async onSuccess(data) {
            console.log(data)
            setSection(data)
        }
    })

    if(isLoading) {
        return <div>Loading...</div>
    }

    const promptRef = useRef<HTMLTextAreaElement>(null)

    const handleGenerate = () => {
        
        mutation.mutate({
            data: {
                prompt: promptRef?.current?.value ?? '',
                returnGPT: true
            }
        })
        
    
    }

    return (
        <>
            <Textarea label='Prompt' 
                      defaultValue={data?.personal?.prompt} 
                      onBlur={e => mutation.mutate({
                            data: {
                                prompt: e.currentTarget?.value ?? '',
                                returnGPT: true
                            }
                        })
                      } 
                      ref={promptRef}
                      />
            <button className="btn btn-primary float-right mt-2" onClick={handleGenerate}>Generate</button>
            <Textarea label='Generated' 
                                    value={section} 
                                    onChange={(e) => setSection(e.target.value)} 
                        />
        </>
    )
}
