import Link from "next/link";
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
            <div className="px-8 max-w-3xl mx-auto mt-48 prose">
                <h1>Now, let's add some work experience</h1>

                <div className="border-b border-gray-900/10 pb-12">
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Start with the most recent.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

                        {
                            data?.workEntries.map(entry => {
                                return (
                                    <WorkExperienceSection key={entry.id} refetch={() => refetch()} {...entry} />
                                )
                            })
                        }
                        <button className="btn btn-primary btn-outline w-48 mx-auto"
                                onClick={() => void addEntry()}
                                >
                                    { addingEntry && <span className="loading loading-spinner"></span>}
                                    Add Another
                        </button>

                    </div>
                </div>  
                <Link href={'/cv/education'}>
                    <button className="btn btn-primary float-right">
                        Next
                    </button>
                </Link>
            </div>
            
            
        </DefaultLayout>
    )
}

export default withProtection(CV)