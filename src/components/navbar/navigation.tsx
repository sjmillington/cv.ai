import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { useRouter } from "next/router";

export default function Navigation() {

    const { data: sessionData } = useSession();
    const router = useRouter()

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost normal-case text-xl" href="/">cv.AI</Link>
            </div>
            {
                sessionData ? (
                    <div className="flex-none gap-2">
                    
                        <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img src={sessionData?.user?.image ?? 'default!'} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><button onClick={() => void signOut({ redirect: false }).then(() => {
                                void router.push('/')
                            }).catch(console.error)} >Sign Out</button></li>
                        </ul>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => void signIn()}>Sign In</button>
                )
            }
            
        </div>
    )

}