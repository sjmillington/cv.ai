import TextInput from "../form/TextInput";
import { api } from "~/utils/api";
import GPTSection from "../form/GPTSection";
import PersonalSection from "./PersonalSection";
import WorkExperienceSection from "./WorkExperienceSection";

export default function InformationForm() {

  const { data, isLoading, refetch } = api.user.current.useQuery();

  const update = api.user.update.useMutation({
    async onMutate({ data }) {
      console.log(data);
    },
  });

  const { mutate: addEntry, isLoading: addingEntry } = api.user.addWorkEntry.useMutation({
    async onSuccess(entry) {
        refetch()
    }
  })

  if(isLoading) {
    return <p>Loading...</p>
  }

  const { name, phoneNumber, email, website } = data ?? {}

  return (
    <div className="prose max-w-full">
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
      

      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
            Work Experience 
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
            Add your experience. Start with the most recent.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

            {
                data?.workEntries.map(entry => {
                    return (
                        <WorkExperienceSection key={entry.id} refetch={() => refetch()} {...entry} />
                    )
                })
            }
            <button className="btn btn-primary btn-outline w-48 mx-auto"
                    onClick={() => void addEntry()}
                     >
                        { addingEntry && <span className="loading loading-spinner"></span>}
                        Add Another
            </button>

        </div>
      </div>



    </div>
  );
}
