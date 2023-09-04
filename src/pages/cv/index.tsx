import { useSession } from "next-auth/react";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";



const CV = function({ session }: SessionProps) {

    return (
        <p>{session.user?.email  }</p>
    )
}

export default withProtection(CV)