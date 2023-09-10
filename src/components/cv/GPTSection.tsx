import { DOMAttributes, FocusEventHandler, forwardRef, useEffect, useRef, useState } from "react"
import Textarea from "../form/Textarea"
import { api } from "~/utils/api"

interface GPTSectionProps {
    onSaveState: (prompt: string | undefined, result: string | undefined) => void,
    prompt: string,
    results: string,
    isGenerating: boolean,
    onGenerateCalled: (prompt: string) => void
}

export default function GPTSection({ onSaveState, prompt, results, isGenerating, onGenerateCalled }: GPTSectionProps) {

    const [ section, setSection ] = useState('')
    const promptRef = useRef<HTMLTextAreaElement>(null)

    
 
    useEffect(() => {
        setSection(results)
    }, [results])

    return (
        <>
            <Textarea label='Prompt' 
                      defaultValue={prompt} 
                      onBlur={e => onSaveState(e.currentTarget.value, undefined)} 
                      ref={promptRef}
                    />
            <button className="btn btn-primary float-right mt-4"
                     onClick={() => onGenerateCalled(promptRef?.current?.value ?? '')}
                     >
                        { isGenerating && <span className="loading loading-spinner"></span>}
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
