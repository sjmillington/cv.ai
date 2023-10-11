import DefaultLayout from "~/layouts/layout";
import Link from "next/link";

import { api } from "~/utils/api";
import GPTSection from "~/components/form/GPTSection";
import { useState } from "react";

export default function Home() {

  const [ text, setText ] = useState('I am a marketing expert with over 12 years in the clown industry. I help clowns find their next party breakthrough.')
  
  const { data, isLoading, fetchStatus, refetch } = api.public.try.useQuery({ text }, { enabled: false })

  const onGenerate = () => {
     refetch().catch(console.error)
  }

  return (
    <DefaultLayout includeNav={false}>
      <div className="pt-24 xl:pt-0 min-h-screen bg-slate-200 px-4 xl:px-16 flex flex-col xl:flex-row xl:items-center">
        <div className="text-center xl:text-left xl:flex-1">
          <div className="">
            <h1 className="text-5xl font-extrabold tracking-light xl:text-6xl">
              Writing CV&apos;s is hard.. <br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">Why bother?</span>
            </h1>
            <p className="py-4 text-lg xl:text-xl font-light">Let AI build your next CV..</p>
            <button className="btn btn-secondary mt-2" ><Link href='/cv'>Get Started</Link></button>
          </div>
        </div>
        <div className="w-full max-w-xl mx-auto xl:mx-8 mt-8 xl:mt-0 xl:flex-1">
          <div className="card bg-white shadow-10xl shadow-gray-900 my-8">
            <div className="card-body">
            <h2 className="card-title mx-auto">Try it out</h2>
              <GPTSection
                prompt={text}
                label={'Tell us about yourself'}
                onSaveState={(prompt) => setText(prompt ?? '')}
                isGenerating={isLoading && fetchStatus === 'fetching'}
                onGenerateCalled={onGenerate}
                results={data ?? ''}
                
              />
              
            </div>
          </div> 
        </div>
      </div>
    </DefaultLayout>
  );
}

