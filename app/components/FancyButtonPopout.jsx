import React, { useState } from "react";

const FancyButtonPopout = ({ onClick, children, popoutComponent }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-1/2 inline-block">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="text-white w-full text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-[#c18557] border-black"
      >
        {children}
      </button>
      {isHovered && (
        <div className="absolute z-10 -top-16 ml-2 left-full mt-2 bg-white border border-gray-300 p-2 rounded-md">
          {popoutComponent}
        </div>
      )}
    </div>
  );
};

export default FancyButtonPopout;