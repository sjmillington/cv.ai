import InformationForm from "~/components/cv/InformationForm";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

const CV = function({ session }: SessionProps) {

    return (
        <DefaultLayout>
            <div className="px-8 max-w-3xl mx-auto mt-48">
                <InformationForm  />  
            </div>
        </DefaultLayout>
    )
}

export default withProtection(CV)