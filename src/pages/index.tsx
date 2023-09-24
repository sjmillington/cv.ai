import DefaultLayout from "~/layouts/layout";
import Link from "next/link";

import { api } from "~/utils/api";
import GPTSection from "~/components/form/GPTSection";
import { useState } from "react";

export default function Home() {

  const [ text, setText ] = useState('I am some initial text about a person, write me a CV personal section')
  
  const { data, isLoading, fetchStatus, refetch } = api.public.try.useQuery({ text }, { enabled: false })

  console.log(fetchStatus)
  console.log(isLoading)

  const onGenerate = () => {
    refetch()
  }

  return (
    <DefaultLayout includeNav={false}>
      <div className="pt-24 xl:pt-0 min-h-screen bg-gray-100 px-4 xl:px-16 flex flex-col xl:flex-row xl:items-center">
        <div className="text-center xl:text-left xl:flex-1">
          <div className="">
            <h1 className="text-4xl font-extrabold tracking-light xl:text-6xl">
              Don't Write Your Next CV. <br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Generate It.</span>
            </h1>
            <p className="py-4 xl:text-xl">Harness the power of AI to build your next CV!</p>
            <button className="btn btn-secondary mt-2">Get Started</button>
          </div>
        </div>
        <div className="w-3/4 mx-auto xl:mx-8 mt-8 xl:mt-0 xl:flex-1">
          <div className="card bg-white shadow-2xl">
            <div className="card-body">
            <h2 className="card-title mx-auto">Try it yourself</h2>
              <GPTSection
                prompt={text}
                onSaveState={(prompt, result) => setText(prompt ?? '')}
                isGenerating={isLoading && fetchStatus === 'fetching'}
                onGenerateCalled={(text) => onGenerate()}
                results={data ?? ''}
                
              />
              
            </div>
          </div> 
        </div>
      </div>
    </DefaultLayout>
  );
}

