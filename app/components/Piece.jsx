import Image from 'next/image';

const Piece = ({ code, colour, style  }) => {
    let image_url = "/pieces/" + colour.toLowerCase() + "/" + code.toLowerCase() + ".png";
    

    return (
        <div style={{ position: 'absolute', ...style }}>
            <Image src={image_url} width={100} height={100} />
        </div>
    );
};

export default Piece;
