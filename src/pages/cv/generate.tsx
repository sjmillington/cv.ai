import CVFormLayout from "~/components/cv/CVFormLayout";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

import generateDefault from "~/pdf/default"

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
                <button className="btn sm:col-span-3" onClick={() => data && generateDefault(data)}>Default</button>
                <button className="btn sm:col-span-3">Retro</button>
                <button className="btn sm:col-span-3">Cyberpunk</button>
                <button className="btn sm:col-span-3">Classic</button>
            </CVFormLayout>
        </DefaultLayout>
    )
}

export default withProtection(Generate)