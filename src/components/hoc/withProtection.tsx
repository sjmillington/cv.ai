
import { type Session } from "next-auth/core/types";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export interface SessionProps {
    session: Session
}

// eslint-disable-next-line react/display-name
const withProtection = <P extends object>(Component: React.ComponentType<P>): React.FC<P & SessionProps> => ({ ...props}: P) =>{

    const { data } = useSession()
    const router = useRouter()

    useEffect(() => {
        if(data === null) {
            router.push('/api/auth/signin')
        }
    }, [])

    return data && <Component {...props } session={data} />
}
    

export default withProtection