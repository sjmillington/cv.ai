import { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string,
    altLabel?: string,
}

export default forwardRef(function TextArea({ label, altLabel, ...rest }: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text text-md text-base-400">{ label }</span>
            </label>
            <textarea placeholder={label} className="textarea textarea-bordered textarea-xl w-full" ref={ref} {...rest} />
            {
                altLabel && (
                    <label className="label">
                        <span className="label-text-alt base-300">{altLabel}</span>
                    </label>
                )
            }
        </div>
    );
});
