import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string,
    altLabel?: string
  //  value: string,
  //  onChange: (value: string) => void
}

export default function TextInput({ label, altLabel, ...rest }: TextInputProps) {

    return (
        <div className="form-control w-full">
        <label className="label">
            <span className="label-text text-md text-base-400">{ label }</span>
        </label>
        <input type="text" placeholder={label} className="input input-bordered w-full" {...rest} />
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