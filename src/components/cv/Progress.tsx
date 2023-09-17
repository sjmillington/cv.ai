import Link from 'next/link'


export type CVProgress = 'Personal' | 'Work' | 'Education' | 'Generation'

interface ProgressProps {
    progress: CVProgress
}

export default function Progress({ progress }: ProgressProps) {

    return (
        <ul className="steps w-full px-0">
            <li className={`step step-primary`}><Link href='/cv'>Personal</Link></li>
            <li className={`step ${progress === 'Work' || progress === 'Generation' || progress === 'Education' ? 'step-primary' : ''}`}><Link href='/cv/work'>Work</Link></li>
            <li className={`step ${progress === 'Generation' || progress === 'Education' ? 'step-primary' : ''}`}><Link href='/cv/education-skills'>Education</Link></li>
            <li className={`step ${progress === 'Generation' ? 'step-primary' : ''}`}><Link href='/cv/generate'>Generate</Link></li>
        </ul>
    )
}