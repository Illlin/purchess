import Image from 'next/image';

const Piece = ({ code, colour, onClick, style  }) => {
    let image_url = "/pieces/" + colour.toLowerCase() + "/" + code.toLowerCase() + ".png";
    

    return (
        <button onClick={onClick} style={{ position: 'absolute', ...style }}>
            <Image src={image_url} width={100} height={100} />
        </button>
    );
};

export default Piece;
