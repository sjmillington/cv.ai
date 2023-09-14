import CVFormLayout from "~/components/cv/CVFormLayout";
import WorkExperienceSection from "~/components/cv/WorkExperienceSection";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

const CV = function({ session }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    const { mutate: addEntry, isLoading: addingEntry } = api.user.addWorkEntry.useMutation({
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
                title="Now, let's add some work experience"
                nextLink='/cv/education'
                subTitle='Start with the most recent.'
                progress='Work'
            >
                <>
                    {
                        data?.workEntries.map((entry, i) => {
                            return (
                                <WorkExperienceSection index={i+1} key={entry.id} refetch={() => refetch()} {...entry} />
                            )
                        })
                    }
                    <button className="btn btn-primary btn-outline w-48 mx-auto"
                            onClick={() => void addEntry()}
                            >
                                { addingEntry && <span className="loading loading-spinner"></span>}
                                Add Another
                    </button>
                </>
            </CVFormLayout>
        </DefaultLayout>
    )
}

export default withProtection(CV)