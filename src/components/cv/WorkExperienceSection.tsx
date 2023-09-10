import TextInput from "../form/TextInput";

import { api } from "~/utils/api"

interface Exprience  {
    id: string;
    role: string | null;
    company: string | null;
    start: string | null;
    end: string | null;
    prompt: string;
    result: string | null
}

export default function WorkExperienceSection({
    id,
    role,
    company,
    start,
    end,
    prompt,
    result
}: Exprience) {

    const update = api.user.updateWorkEntry.useMutation()

    return (
        <>
            <div className="sm:col-span-6">
                <TextInput
                    defaultValue={company ?? ''}
                    onBlur={(e) => {
                        update.mutate({ id, data: { company: e.currentTarget.value } });
                    }}
                    label="Company name"
                />
            </div>

           <div className="sm:col-span-3">
             <TextInput
               defaultValue={start ?? ''}
               onBlur={(e) => {
                 update.mutate({ id, data: { start: e.currentTarget.value } });
               }}
               label="Start Date"
               placeholder='For example, "June 2019"'
             />
           </div>

           <div className="sm:col-span-3">
             <TextInput
               defaultValue={end ?? ''}
               onBlur={(e) => {
                 update.mutate({ id, data: { end: e.currentTarget.value } });
               }}
               label="End Date"
               placeholder='For example, "June 2019 or Present"'
             />
           </div>
            <p>Hello</p>

            <div className="border-b border-gray-900/10 pb-12 sm:col-span-6"></div>
            {/*   <GPTSection 

                onSaveState={(prompt, result) => {
                personalSectionMutation.mutate({
                    data: {
                        prompt,
                        result
                    }
                })
            }} /> */}
        </>
    )
}