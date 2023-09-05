import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"

export default function Navigation() {

    const { data: sessionData } = useSession();

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">cv.AI</a>
            </div>
            {
                sessionData ? (
                    <div className="flex-none gap-2">
                         <ul className="menu menu-horizontal">
                            <li><Link href="/cv">Create CV</Link></li>
                        </ul>
                        <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img src={sessionData?.user?.image ?? 'default!'} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            {/* <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                            </li>
                            <li><a>Settings</a></li> */}
                            <li><button onClick={() => void signOut()} >Sign Out</button></li>
                        </ul>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => signIn()}>Sign In</button>
                )
            }
            
        </div>
    )

}