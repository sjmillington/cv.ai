import { useSession } from "next-auth/react";
import TextInput from "../form/TextInput";

import { api } from "~/utils/api";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { useEffect, useState } from "react";

export default function InformationForm() {

 

    const user = api.user.current.useQuery()

    const [ name, setName ] = useState('')
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ email, setEmail ] = useState('')

    useEffect(() => {
        setName(user.data?.name ?? '')
        setPhoneNumber(user.data?.phoneNumber ?? '')
        setEmail(user.data?.email ?? '')
    }, [user.data])

    const update =  api.user.update.useMutation({
        async onMutate({ data }) {
            console.log(data) 
        }
    })


    return (
        <div className="prose max-w-full">
            <h1 >Let's build your next CV</h1>
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Start with some simple contact information.</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                    <TextInput value={name}
                        onChange={e => setName(e.target.value)} 
                        onBlur={() => {
                            update.mutate({ data: { name }})
                        }}
                        label='Enter your name' 
                    />
                    </div>

                    <div className="sm:col-span-3">
                    <TextInput value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)} 
                        onBlur={() => {
                            update.mutate({ data: { phoneNumber }})
                        }}
                        label='Enter your Phone Number' 
                    />
                    </div>

                    <div className="sm:col-span-3">
                    <TextInput value={email}
                        onChange={e => setEmail(e.target.value)} 
                        onBlur={() => {
                            update.mutate({ data: { email }})
                        }}
                        label='Enter your Email' 
                    />
                    </div>
                </div>
            </div>
            
           
        </div>
    )
}