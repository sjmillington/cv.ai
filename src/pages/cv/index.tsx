import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";
import TextInput from "~/components/form/TextInput";

import { api } from '~/utils/api'
import PersonalSection from "~/components/cv/PersonalSection";
import Link from "next/link";

const CV = function({ session }: SessionProps) {

    const { data, isLoading, refetch } = api.user.current.useQuery();

    const update = api.user.update.useMutation({
        async onMutate({ data }) {
        console.log(data);
        },
    });

    if(isLoading) {
        return <p>Loading...</p>
    }

    const { name, phoneNumber, email, website } = data ?? {}

    return (
        <DefaultLayout>
            <div className="my-8 max-w-3xl mx-auto mt-48 prose">
                <h1>Let's build your next CV</h1>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Start with some simple information.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <TextInput
                            defaultValue={name ?? ''}
                            onBlur={(e) => {
                                update.mutate({ data: { name: e.currentTarget.value } });
                            }}
                            label="Enter your name"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <TextInput
                            defaultValue={phoneNumber ?? ''}
                            onBlur={(e) => {
                                update.mutate({ data: { phoneNumber: e.currentTarget.value } });
                            }}
                            label="Enter your Phone Number"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <TextInput
                            defaultValue={email ?? ''}
                            onBlur={(e) => {
                                update.mutate({ data: { email: e.currentTarget.value } });
                            }}
                            label="Enter your Email"
                            />
                        </div>
                        <div className="sm:col-span-6">
                            <TextInput
                            defaultValue={website ?? ''}
                            onBlur={(e) => {
                                update.mutate({ data: { website: e.currentTarget.value } });
                            }}
                            label="Enter a Web Address"
                            placeholder="This could be a personal website or a LinkedIn profile"
                            />
                        </div>
                    </div>
                </div>

                <PersonalSection />
                <Link href={'/cv/work'}>
                    <button className="btn btn-primary float-right my-4">
                        Next
                    </button>
                </Link>
            </div>
        
        </DefaultLayout>
    )
}

export default withProtection(CV)