const FancyButton = ({ onClick, children  } ) => {
    return (
        <button
            onClick={onClick}
            className="text-white w-full text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-[#c18557] border-black"
        >
            {children}
        </button>
    );
};

export default FancyButton;
