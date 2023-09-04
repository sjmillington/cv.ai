
import { Session } from "next-auth/core/types";
import { useSession } from "next-auth/react";

export interface SessionProps {
    session: Session
}

const withProtection = <P extends object>(Component: React.ComponentType<P>): React.FC<P & SessionProps> => ({ ...props}: P) =>{

    const { data } = useSession()

    if(!data) {
        return <p>Access Denied</p>
    }


    return <Component {...props as P} session={data} />
}
    

export default withProtection