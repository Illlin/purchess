"use client"

import React from 'react';
import Image from 'next/image'
import Piece from './Piece';
import { useState } from 'react';

export default function Board({ x, y, pieces, moves, gameId, update }) {
  let [points, setPoints] = useState([])
  let width = x;
  let height = y;

  const squareStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  };

  const clickedSquare = (x, y) => {
    let newArray = moves
    setPoints(newArray.filter(move => move.from_x === x && move.from_y === y).map(move => ({fx:move.from_x, fy:move.from_y, x: move.to_x, y: move.to_y})));
    console.log(points);
  };

  function postGameData(data) {
    console.log(data)
    fetch(`/api/game/${gameId}/send_move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add any other headers if necessary
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the response here if needed
    })
    .catch(error => {
      // Handle any errors from the request
      console.error('Error:', error);
    });
  }

  return (
    <div className="relative">
      <div className="flex flex-col">
        {[...Array(height)].map((_, row) => (
          <div key={row} className="flex">
            {[...Array(width)].map((_, col) => (
              <div
                key={col}
                className={`aspect-square w-full ${(row + col) % 2 === 0 ? "bg-[#c18557]" : "bg-amber-100"
                  }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {pieces.map((piece, index) => (
        <div>
          <Piece
            code={piece.type}
            colour={piece.colour}
            onClick={() => { clickedSquare(piece.x, piece.y) }}
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
      {points.map((point, index) => (
        <div>
          <button 
            className="rounded-full bg-green-500 opacity-50"
            onClick={() => { postGameData({from_x:point.fx, from_y:point.fy, to_x:point.x, to_y:point.y}); update(); setPoints([]); }}
            style={{
              position: "absolute",
              top: `${(100 * point.y + 50/2) / height}%`,
              left: `${(100 * point.x + 50/2) / width}%`,
              width: `${50 / width}%`,
              height: `${50 / height}%`,
              ...squareStyle,
            }}
          />
        </div>
      ))}
    </div>
  );
}