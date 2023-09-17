import { useState } from "react"
import TextInput from "./TextInput"

interface Props {
    items: string[],
    onAdd: (item: string) => void,
    onRemove: (item: string) => void
}

export default function ListInput({ items, onAdd, onRemove }: Props) {

    const [ entry, setEntry ] = useState('')

    const handleAdd = () => {
        onAdd(entry)
        setEntry('')
    }

    return (
        <>
            <div className="flex items-end">
                <TextInput 
                    label='New Entry' 
                    value={entry} 
                    onChange={e => setEntry(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === 'Enter') {
                            handleAdd();
                        }
                    }}
                />
                <button className="btn btn-primary ml-2" onClick={handleAdd}>
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {
                    items.map((item) => (
                        <div key={item} className="badge badge-primary badge-outline gap-2 p-4">
                            <button onClick={() => onRemove(item)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            { item }
                        </div>
                    ))
                }
            </div>
        </>
    )
}