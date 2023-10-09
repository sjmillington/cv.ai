import CVFormLayout from "~/components/cv/CVFormLayout";
import withProtection, { SessionProps } from "~/components/hoc/withProtection";
import DefaultLayout from "~/layouts/layout";

import { RouterOutputs, api } from "~/utils/api";

import generateDefault from "~/pdf/default"
import { useEffect, useRef, useState } from "react";
import ColourPicker, { Hex, colours } from "~/components/form/ColourPicker";
import { formatMonthYearDate } from "~/utils/formatters";


const download = (data: RouterOutputs['user']['current']) => {
    const a = document.createElement("a");

    const lines = [
        data?.name,
        data?.phoneNumber,
        data?.email,
        data?.website,
        data?.personal?.result,
        '',
        'Work',
        '',
        data?.workEntries?.map(entry => {
            return [
                '',
                entry.company,
                entry.start ? formatMonthYearDate(entry.start) : '',
                entry.end ? formatMonthYearDate(entry.end) : '',
                entry.role,
                entry.result,
                ''
            ].join('\n')
        }) ?? '',
        '',
        'Education',
        '',
        data?.education?.institution,
        data?.education?.course,
        data?.education?.start ? formatMonthYearDate(data.education.start) : '',
        data?.education?.end ? formatMonthYearDate(data.education.end) : '',
        data?.education?.grade,
        data?.education?.result,
        '',
        'Skills',
        '',
        data?.skills?.join(', ')
    ].filter(line => line !== undefined).join('\n')

    const file = new Blob([lines], { type: 'txt' });
    a.href = URL.createObjectURL(file);
    a.download = 'cv.ai.txt';
    a.click();
}

const Generate = function({ session }: SessionProps) {

    const ref = useRef<HTMLIFrameElement>(null)
    const [ iframeSrc, setIframeSrc ] = useState('')
    const { data, isLoading } = api.user.current.useQuery();
    const [ colour, setColour ] = useState<Hex>(colours[0]!.hex)

    const drawPDF = async () => {
        if(data) {
            const d = await generateDefault(data, { colour })
            if(d) {
                setIframeSrc(d)
            }
        }
    }
    
    const handleDownload = () => {
        if(data) {
            download(data)
        }
    }

    useEffect(() => {
        drawPDF()
     }, [ colour, data ])

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
        <DefaultLayout>
            <CVFormLayout 
                title="Now for the fun bit!"
                subTitle="Let's generate your CV!"
                progress='Generation'
            >
                
                <div className="sm:col-span-6">
                    <p>Pick a Primary colour</p>
                    <ColourPicker onPicked={setColour} />
                </div>
                <div className="sm:col-span-6 mt-8">
                    <div className="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className='text-sm'>Depending on your content, this may not render correctly. 
                            You can go back to modify your content to fit, or click the button below to export the plain-text and do it elsewhere, like Word. (other word processors are available). <br/><br/>
                            Or hey, this just might not be your style!
                        </span>
                    </div>
                    <button className="btn mt-2 rounded-xl text-sm" onClick={handleDownload}>Export as plain-text</button>
                </div>
                
            </CVFormLayout>
            <iframe id="pdf" className='w-full' style={{ minHeight: 1000 }} ref={ref} src={iframeSrc} ></iframe>
        </DefaultLayout>
    )
}

export default withProtection(Generate)