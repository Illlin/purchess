import React from 'react';
import Image from 'next/image'
import Piece from './Piece';

export default function Board({ x, y, pieces }) {
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
                    (row + col) % 2 === 0 ? "bg-[#c18557]" : "bg-amber-100"
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        {pieces.map((piece, index) => (
            <div>
                <Piece
                    code={piece.code}
                    colour={piece.colour}
                    style={{
                    top: `${(100 * piece.y) / height}%`,
                    left: `${(100 * piece.x) / width}%`,
                    width: `${100 / width}%`,
                    height: `${100 / height}%`,
                    ...squareStyle,
                    }}
                />
            </div>
        ))}
      </div>
    );
  }