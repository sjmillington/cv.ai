
import GPTSection from "../form/GPTSection"

import { api } from "~/utils/api"

export default function PersonalFunction() {

    const { data, refetch } = api.user.current.useQuery()

    const personalSectionMutation = api.user.personalSection.useMutation({
        async onSuccess(data) {
            console.log(data)
        }
    })

    const { mutate: runGPT, isLoading } = api.user.personalSectionGTP.useMutation({
        async onSuccess(result: string) {
            refetch() //todo - this could be done with setData, but i'm being lazy
        }
    })

    return (
        <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Section
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
            Add some information about who you are and what you do
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
                <GPTSection 
                    isGenerating={isLoading}
                    onGenerateCalled={prompt => runGPT({ data: { prompt }})}
                    prompt={data?.personal?.prompt ?? ''}
                    results={data?.personal?.result ?? ''}
                    onSaveState={(prompt, result) => {
                    personalSectionMutation.mutate({
                        data: {
                            prompt,
                            result
                        }
                    })
                }} />
            </div>
            </div>
        </div>
    )

}