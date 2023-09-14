import CVFormLayout from "~/components/cv/CVFormLayout";
import EducationSection from "~/components/cv/EducationSection";
import WorkExperienceSection from "~/components/cv/WorkExperienceSection";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

const CV = function({ session }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    const { mutate: addEntry, isLoading: addingEntry } = api.user.education.useMutation({
        async onSuccess(entry) {
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
            </CVFormLayout>
        </DefaultLayout>
    )
}

export default withProtection(CV)