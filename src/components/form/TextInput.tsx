
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string,
    altLabel?: string,
    ref?: React.Ref<HTMLInputElement>
}

export default function TextInput({ label, altLabel, ref, ...rest }: TextInputProps) {

    return (
        <div className="form-control w-full">
        <label className="label">
            <span className="label-text text-md text-base-400">{ label }</span>
        </label>
        <input type="text" placeholder={label} className="input input-bordered w-full" {...rest} ref={ref} />
        {
            altLabel && (
                <label className="label">
                    <span className="label-text-alt base-300">{altLabel}</span>
                </label>
            )
        }
        </div>
    )
}