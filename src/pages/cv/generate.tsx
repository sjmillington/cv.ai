import CVFormLayout from "~/components/cv/CVFormLayout";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { api } from "~/utils/api";

import generateDefault from "~/pdf/default"
import { useRef, useState } from "react";

const Generate = function({ session }: SessionProps) {

    const ref = useRef<HTMLIFrameElement>(null)
    const [ iframeSrc, setIframeSrc ] = useState('')
    const { data, isLoading, refetch } = api.user.current.useQuery();

    if(isLoading) {
        return <p>Loading...</p>
    }

    const handle = async () => {
        if(data) {
            const d = await generateDefault(data)
            console.log(d)
            if(d) {
                setIframeSrc(d)
            }
        }
    }

    // const ref = useRef<HTMLIFrameElement>(null)

    return (
        <DefaultLayout>
            <CVFormLayout 
                title="Now for the fun bit!"
                subTitle="Let's generate your personal CV!"
                progress='Generation'
            >
                <button className="btn sm:col-span-3" onClick={handle} >Default</button>
                <button className="btn sm:col-span-3">Retro</button>
                <button className="btn sm:col-span-3">Cyberpunk</button>
                <button className="btn sm:col-span-3">Classic</button>
                
            </CVFormLayout>
            <body>
                <iframe id="pdf" className='w-full' style={{ minHeight: 1000 }} ref={ref} src={iframeSrc} ></iframe>
            </body>
        </DefaultLayout>
    )
}

export default withProtection(Generate)