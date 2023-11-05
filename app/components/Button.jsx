const Button = ({ children  }) => {
    return (
        <div className="text-white text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-[#c18557] border-black">
            {children}
        </div>
    );
};

export default Button;
