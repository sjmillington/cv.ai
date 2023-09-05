import { useSession } from "next-auth/react";
import InformationForm from "~/components/cv/InformationForm";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";
import { api } from '~/utils/api'

const CV = function({ session }: SessionProps) {



    return (
        <DefaultLayout>
            <div className="px-32 mt-48">
            <InformationForm  /> 
        
            </div>
        </DefaultLayout>
    )
}

export default withProtection(CV)