import GPTSection from "../form/GPTSection";
import TextInput from "../form/TextInput";

import { api } from "~/utils/api"

interface Exprience  {
    id: string;
    role: string | null;
    company: string | null;
    start: Date | null;
    end: Date | null;
    prompt: string;
    result: string | null,
    refetch: () => {}
}

const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth()+1}`
}


export default function WorkExperienceSection({
    id,
    role,
    company,
    start,
    end,
    prompt,
    result,
    refetch
}: Exprience) {

    const update = api.user.updateWorkEntry.useMutation({
        onSuccess() {
            refetch()
        }
    })

    const { mutate: runGPT, isLoading } = api.user.workEntryGPT.useMutation({
        onSuccess() {
            refetch()
        }
    })

    return (
        <>
            <div className="sm:col-span-3">
                <TextInput
                    defaultValue={company ?? ''}
                    onBlur={(e) => {
                        update.mutate({ id, data: { company: e.currentTarget.value } });
                    }}
                    label="Company"
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                    defaultValue={role ?? ''}
                    onBlur={(e) => {
                        update.mutate({ id, data: { role: e.currentTarget.value } });
                    }}
                    label="Role"
                />
            </div>

           <div className="sm:col-span-3">
             <TextInput
               defaultValue={start ? formatDate(start) : ''}
               onBlur={(e) => {
                    console.log(e)
                    if(e.currentTarget.valueAsDate instanceof Date) {
                        update.mutate({ id, data: { start: e.currentTarget.valueAsDate } });
                    }
               }}
               label="Start Date"
               type='month'
             />
           </div>

           <div className="sm:col-span-3">
             <TextInput
               defaultValue={end ? formatDate(end) : ''}
               onBlur={(e) => {
                if(e.currentTarget.valueAsDate instanceof Date) {
                    update.mutate({ id, data: { end: e.currentTarget.valueAsDate } });
                }
               }}
               label="End Date"
               altLabel="Leave this blank if you're currently working here"
               type='month'
             />
           </div>
           <div className="sm:col-span-6">
             <GPTSection 
                prompt={prompt}
                results={result ?? ''}
                onGenerateCalled={prompt => runGPT({ id, data: { prompt }}) }
                isGenerating={isLoading}
                onSaveState={(prompt, result) => {
                    update.mutate({
                        id,
                        data: {
                            prompt,
                            result
                        }
                    })
                }}
             />

           </div>
            <div className="border-b border-gray-900/10 pb-12 sm:col-span-6"></div>
        </>
    )
}