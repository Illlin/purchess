import Image from 'next/image'

export default function Piece(x, y, code) {

    image_url = "/Knook.png"

    return (
        <Image
            src="/Knook.png"
            width={100}
            height={100}
            className="absolute"
            style={{
                top: `${(100 * 1) / height}%`,
                left: `${(100 * 3) / width}%`,
                width: `${100 / width}%`,
                height: `${100 / height}%`,
                ...squareStyle,
            }}
        />
    )
}



