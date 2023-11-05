"use client"

import Image from 'next/image'
import Board from '../components/Board'
import FancyButton from '../components/Button'
import GameMaker from '../components/GameMaker'
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const gameName = searchParams.get('gameName')

  const [data, setData] = useState({ width: 8, height: 8, pieces: [] })
  const [moves, setMoves] = useState({})

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

  useEffect(() => {
    getMoves();
    getStatus();
  }, []);

  console.log("Fish?!")
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="max-w-screen-md">

        </div>
      </div>
      <div className="flex grid grid-cols-2 justify-center m-4">
        <div className="flex-none">
          <Board
            x={data.width}
            y={data.height}
            pieces={data.pieces}
          />
        </div>
        <div className="w-1/3">
          GAME!!!! {JSON.stringify(data)}
          {JSON.stringify(moves)}
        </div>
      </div>


    </div>
  )
}
