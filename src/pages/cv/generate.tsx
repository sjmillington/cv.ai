import CVFormLayout from "~/components/cv/CVFormLayout";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

const Generate = function({ session }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
        <DefaultLayout>
            <CVFormLayout 
                title="Now for the fun bit!"
                subTitle="Let's generate your personal CV!"
                progress='Generation'
            >
                
            </CVFormLayout>
        </DefaultLayout>
    )
}

export default withProtection(Generate)