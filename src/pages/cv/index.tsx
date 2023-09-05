import { useSession } from "next-auth/react";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";


const CV = function({ session }: SessionProps) {

    return (
        <DefaultLayout>
            <p>{session.user?.email  }</p>
        </DefaultLayout>
    )
}

export default withProtection(CV)