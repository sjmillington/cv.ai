
import GPTSection from "../form/GPTSection"

import { api } from "~/utils/api"
import TextInput from "../form/TextInput"
import { formatMonthYearDate } from "~/utils/formatters"

export default function EducationSection() {

    const { data, refetch } = api.user.current.useQuery()

    const update = api.user.education.useMutation({
        async onSuccess(data) {
            console.log(data)
        }
    })

    console.log(data)

    const { mutate: runGPT, isLoading } = api.user.educationGTP.useMutation({
        async onSuccess(result: string) {
            refetch() //todo - this could be done with setData, but i'm being lazy
        }
    })

    return (
       <>
            <div className="sm:col-span-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                Education 
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                This is especially useful if you've recently graduated. 
                If you've been in the work place for longer, you may wish to omit a 
                description.
                </p>
            </div>

            <div className="sm:col-span-6">
                <TextInput
                    defaultValue={data?.education?.course ?? ''}
                    onBlur={(e) => {
                        update.mutate({ data: { course: e.currentTarget.value } });
                    }}
                    label="Course"
                />
            </div>

            <div className="sm:col-span-6">
                <TextInput
                    defaultValue={data?.education?.institution ?? ''}
                    onBlur={(e) => {
                        update.mutate({ data: { course: e.currentTarget.value } });
                    }}
                    label="Institution"
                />
            </div>

            <div className="sm:col-span-6">
                <TextInput
                    defaultValue={data?.education?.grade ?? ''}
                    onBlur={(e) => {
                        update.mutate({ data: { grade: e.currentTarget.value } });
                    }}
                    label="Grade"
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                defaultValue={data?.education?.start ? formatMonthYearDate(data.education.start) : ''}
                onBlur={(e) => {
                        console.log(e)
                        if(e.currentTarget.valueAsDate instanceof Date) {
                            update.mutate({ data: { start: e.currentTarget.valueAsDate } });
                        }
                }}
                label="Start Date"
                type='month'
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                defaultValue={data?.education?.end ? formatMonthYearDate(data.education.end) : ''}
                onBlur={(e) => {
                    if(e.currentTarget.valueAsDate instanceof Date) {
                        update.mutate({ data: { end: e.currentTarget.valueAsDate } });
                    }
                }}
                label="End Date"
                altLabel="Leave this blank if you're currently studying here"
                type='month'
                />
            </div>

            <div className="sm:col-span-6">
                <GPTSection 
                    isGenerating={isLoading}
                    onGenerateCalled={prompt => runGPT({ data: { prompt }})}
                    prompt={data?.education?.prompt ?? ''}
                    results={data?.education?.result ?? ''}
                    onSaveState={(prompt, result) => {
                    update.mutate({
                        data: {
                            prompt,
                            result
                        }
                    })
                }} />
            </div>
          
     
        </>
    )

}