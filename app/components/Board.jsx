import React from 'react';
import Image from 'next/image'

export default function Board({ x, y }) {
    let width = x;
    let height = y;
  
    const squareStyle = {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    };
  
    return (
      <div className="relative">
        <div className="flex flex-col">
          {[...Array(height)].map((_, row) => (
            <div key={row} className="flex">
              {[...Array(width)].map((_, col) => (
                <div
                  key={col}
                  className={`aspect-square w-full ${
                    (row + col) % 2 === 0 ? "bg-amber-700" : "bg-amber-100"
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <Image
            src="/Knook.png"
            width={100}
            height={100}
            className="absolute invert"
            style={{
            top: `${(100 * 1) / height}%`,
            left: `${(100 * 3) / width}%`,
            width: `${100 / width}%`,
            height: `${100 / height}%`,
            ...squareStyle,
            }}
        />
      </div>
    );
  }