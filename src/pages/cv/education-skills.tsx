import CVFormLayout from "~/components/cv/CVFormLayout";
import EducationSection from "~/components/cv/EducationSection";
import ListInput from "~/components/form/ListInput";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

const CV = function({ session }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    const { mutate, isLoading: updating } = api.user.update.useMutation({
        onSuccess() {
            refetch()
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
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                    This is especially useful if you've recently graduated. 
                    If you've been in the work place for longer, you may wish to omit a 
                    description.
                    </p> */}
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