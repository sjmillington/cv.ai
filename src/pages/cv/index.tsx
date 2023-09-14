import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";
import TextInput from "~/components/form/TextInput";

import { api } from '~/utils/api'
import PersonalSection from "~/components/cv/PersonalSection";
import CVFormLayout from "~/components/cv/CVFormLayout";

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
            <CVFormLayout 
                title="Let's build your next CV"
                nextLink='/cv/work'
                subTitle='Start with some simple information about you.'
                progress='Personal'
            >
                <>
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

                        <PersonalSection />
                </>

            </CVFormLayout>
        
        </DefaultLayout>
    )
}

export default withProtection(CV)