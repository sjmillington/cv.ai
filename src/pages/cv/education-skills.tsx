import CVFormLayout from "~/components/cv/CVFormLayout";
import EducationSection from "~/components/cv/EducationSection";
import ListInput from "~/components/form/ListInput";
import withProtection, { type SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

const CV = function({ }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    const { mutate } = api.user.update.useMutation({
        async onSuccess() {
            await refetch()
        }
    })

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
        <DefaultLayout>
            <CVFormLayout 
                title="Finally, add your education and skills"
                nextLink='/cv/generate'
                progress='Education'
            >
                <EducationSection />

                <div className="sm:col-span-6">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                     Skills 
                    </h3>
                    <ListInput 
                        items={data?.skills ?? []}
                        onAdd={item => mutate({ data: { skills: [...data?.skills ?? [], item] } })}
                        onRemove={(item) => mutate({ data: { skills: data?.skills?.filter(skill => skill !== item) ?? [] } })}
                    />
                </div>

            </CVFormLayout>
        </DefaultLayout>
    )
}

export default withProtection(CV)