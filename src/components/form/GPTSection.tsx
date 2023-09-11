import { DOMAttributes, FocusEventHandler, forwardRef, useEffect, useRef, useState } from "react"
import Textarea from "./Textarea"
import { api } from "~/utils/api"

interface GPTSectionProps {
    onSaveState: (prompt: string | undefined, result: string | undefined) => void,
    prompt: string,
    results: string,
    isGenerating: boolean,
    onGenerateCalled: (prompt: string) => void
}

const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;
  
        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };

export default function GPTSection({ onSaveState, prompt, results, isGenerating, onGenerateCalled }: GPTSectionProps) {

    const [ section, setSection ] = useState('')
    const promptRef = useRef<HTMLTextAreaElement>(null)
    const generateRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setSection(results)
    }, [results])

    useAutosizeTextArea(promptRef.current, prompt)
    useAutosizeTextArea(generateRef.current, section)

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
                        ref={generateRef}
                        onChange={(e) => setSection(e.target.value)} 
                        onBlur={(e) => onSaveState(undefined, e.currentTarget.value)}
                    />
        </>
    )
}
