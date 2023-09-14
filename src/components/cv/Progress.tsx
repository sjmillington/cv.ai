
export type CVProgress = 'Personal' | 'Work' | 'Education' | 'Generation'

interface ProgressProps {
    progress: CVProgress
}

export default function Progress({ progress }: ProgressProps) {

    return (
        <ul className="steps w-full px-0">
            <li className={`step step-primary`}>Personal</li>
            <li className={`step ${progress === 'Work' || progress === 'Generation' || progress === 'Education' ? 'step-primary' : ''}`}>Work</li>
            <li className={`step ${progress === 'Generation' || progress === 'Education' ? 'step-primary' : ''}`}>Education</li>
            <li className={`step ${progress === 'Generation' ? 'step-primary' : ''}`}>Generate</li>
        </ul>
    )
}