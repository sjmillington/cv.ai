import { useState } from "react"

export type Hex = `#${string}`

type Colour = {
    bg: `bg-${string}-500`,
    hex: Hex
}

export const colours: Colour[] = [
    {
        bg: 'bg-red-500',
        hex: '#ef4444'
    },
    {
        bg: 'bg-orange-500',
        hex: '#f97316'
    },
    {
        bg: 'bg-amber-500',
        hex: '#f59e0b'
    },
    {
        bg: 'bg-yellow-500',
        hex: '#eab308'
    },
    {
        bg: 'bg-lime-500',
        hex: '#84cc16'
    },
    {
        bg: 'bg-green-500',
        hex: '#22c55e'
    },
    {
        bg: 'bg-emerald-500',
        hex: '#10b981'
    },
    {
        bg: 'bg-teal-500',
        hex: '#14b8a6'
    },
    {
        bg: 'bg-cyan-500',
        hex: '#06b6d4'
    },
    {
        bg: 'bg-sky-500',
        hex: '#0ea5e9'
    },
    {
        bg: 'bg-indigo-500',
        hex: '#6366f1'
    },
    {
        bg: 'bg-fuchsia-500',
        hex: '#d946ef'
    }
]

interface Props {
    onPicked: (hex: Hex) => void
}

export default function ColourPicker({ onPicked }: Props) {

    const [ picked, setPicked ] = useState<`#${string}`>(colours[0]!.hex)

    const handlePicked = (hex: Hex) => {
        setPicked(hex)
        onPicked(hex)
    }


    return (
        <div className='flex flex-wrap place-content-between mx-4'>
            {
                colours.map(colour => {
                
                    return (
                        <button key={colour.bg} 
                                className={`${colour.bg} w-10 h-10 rounded-md ${picked === colour.hex ? 'border-2 border-blue-500': ''}`} 
                                onClick={() => handlePicked(colour.hex)}
                                />
                    )
                })
            }
        </div>
    )

}