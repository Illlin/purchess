"use client"

import Image from 'next/image'
import Board from '../components/Board'
import FancyButton from '../components/Button'
import GameMaker from '../components/GameMaker'
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import Winner from '../components/winnerPopup'

export default function Home() {
  const searchParams = useSearchParams()
  const gameName = searchParams.get('gameName')

  const [data, setData] = useState({ width: 8, height: 8, pieces: [], players:{}, winner:"none", colour:"white" })
  const [moves, setMoves] = useState({moves:[]})

  const getStatus = () => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/game/' + gameName);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }

  const getMoves = () => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/game/' + gameName + '/valid_moves');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMoves(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }

  const update = async () => {
    const delay = 1000; // Set the delay time in milliseconds (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log("slow down");
    // Call getMoves API
    await getMoves();
    await getStatus();
  };
  
  useEffect(() => {
    update();
  }, [data]);

  console.log("Fish?!")
  return (
    <div className="w-full">
      <div className="flex-1 grid grid-cols-2 justify-center m-4">
        <div className="w-full border-4 border-black h-fit">
          <Board
            x={data.width}
            y={data.height}
            pieces={data.pieces}
            moves={moves.moves}
            gameId={gameName}
            update={update}
            black={data.colour == "black"}
          />
        </div>
        <div className="border-4 border-black m-4 p-4 mt-0 h-fit bg-yellow-100">
          <Winner winner={data.winner}/>
          <span className="grid grid-cols-3 items-center">
            <span className="text-right font-bold text-2xl">{data.players.white}</span>
            <span className="text-center">vs</span>
            <span className="text-left font-bold text-2xl">{data.players.black}</span>
          </span>
          <div className="m-4 flex grid grid-cols-2 items-center">
            <span className="text-right text-2xl font-bold">To move: </span><Image className="flex inline-block" src={`/pieces/${data.turn}/king.png`} width={64} height={64} />
          </div>
        </div>
      </div>
    </div>
  )
}
