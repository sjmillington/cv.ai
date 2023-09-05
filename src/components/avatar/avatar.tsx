
interface AvatarProps {
    src: string
}

export default function Avatar({ src}: AvatarProps ) {

    return (
        <div className="avatar">
            <div className="w-8 rounded-full">
                <img src={src} />
            </div>
        </div>
    )

}