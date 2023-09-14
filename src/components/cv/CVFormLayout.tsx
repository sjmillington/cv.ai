import { PropsWithChildren } from "react";
import Progress, { CVProgress } from "./Progress";
import Link from "next/link";

interface Props extends PropsWithChildren {
  nextLink?: string
  title: string,
  subTitle?: string,
  progress: CVProgress
}

export default function CVFormLayout({ children, nextLink, progress, title, subTitle }: Props) {

    return (
        <div className="px-8 max-w-3xl mx-auto mt-36 prose">
        <Progress progress={ progress } />
        <h1 className='mt-8'>{ title } </h1>

        <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">
                { subTitle }
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

                { children }

            </div>
        </div>  
        {
            nextLink && (
                <Link href={nextLink}>
                    <button className="btn btn-primary float-right my-4">
                        Next
                    </button>
                </Link>
            )
        }
    </div>
    
    )
}