"use client"

import Image from 'next/image'
import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Board from './Board';
import FancyButton from './Button';
import FancyButtonPopout from './FancyButtonPopout';



export default function GameMaker() {
  const router = useRouter()

  // Function to generate a random chess lobby name
  function generateChessLobbyName() {
    const chessWords = [
      'Pawn', 'Bishop', 'Knight', 'Rook', 'Queen', 'King', 'Checkmate', 'Castling', 'En-passant', 'Stalemate', 'Capture', 'Board', 'Opponent', 'Strategy', 'Tactic', 'Opening', 'Middle-game', 'Endgame', 'Pawn-structure', 'Development', 'Center', 'Attack', 'Defense', 'Counterplay', 'Position', 'Weakness', 'Initiative', 'Zugzwang', 'Skewer', 'Pin', 'Fork', 'Discovered-attack', 'Discovered-check', 'Double-attack', 'Deflection', 'Interference', 'Windmill', 'X-ray', 'Zwischenzug', 'Blunder', 'Trap', 'Gambit', 'Exchange', 'Material', 'Piece', 'Rook-lift', 'Promotion', 'Tempo', 'Deflection', 'Overprotection', 'Outpost', 'Space', 'Outflank', 'Undermining', 'Fortress', 'Zugzwang', 'Between', 'Perpetual-check', 'Domination', 'Initiative', 'Compensation', 'Fianchetto', 'Isolated-pawn', 'Hanging-pawn', 'Back-rank', 'King-walk', 'Lucena-position', 'Opposition', 'Triangulation', 'Minority-attack', 'Theoretical-draw', 'Overprotection', 'Outpost', 'Space', 'Outflank', 'Undermining', 'Fortress', 'Zugzwang', 'Between', 'Perpetual-check', 'Domination', 'Initiative', 'Compensation', 'Fianchetto', 'Isolated-pawn', 'Hanging-pawn', 'Back-rank', 'King-walk', 'Lucena-position', 'Opposition', 'Triangulation', 'Minority-attack', 'Theoretical-draw', 'Blitz', 'Endgame-tablebase', 'Chess-clock', 'Time-pressure', 'Increment', 'Bullet', 'Rapid', 'Blitz', 'Classical', 'Time-trouble', 'Increment', 'Time-management', 'Pre-move', 'Transposition', 'Variation', 'Theory', 'Notation', 'Arbiter', 'Chess-club', 'Tournament', 'Rating', 'Elo-rating', 'FIDE', 'Draw-offer', 'Resignation', 'Time-forfeit', 'Adjournment', 'Rematch', 'Spectator', 'Tournament-director', 'Time-control', 'Pairing', 'Bye', 'Double-round-robin', 'Swiss-system', 'Round-robin', 'Elimination', 'Bracket', 'Seeding', 'Wildcard', 'Forfeit', 'Repetition', 'Rule', 'Notation', 'Time-control', 'Clock', 'Rating', 'Tournament', 'Chess-variant', 'Endgame-study', 'Chess-problem', 'Simultaneous-exhibition', 'Blindfold-chess', 'Chess-set', 'Chessboard', 'Algebraic-notation', 'Chess-clock', 'Check', 'Draw', 'Mate', 'Resign', 'Stalemate', 'Atomic-chess', 'Antichess', 'Racing-kings', 'King-of-the-hill', 'Three-check', 'Crazyhouse', 'Horde-chess', 'Chess960', 'Suicide-chess'
    ];    const randomWords = [];
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * chessWords.length);
      randomWords.push(chessWords[randomIndex]);
    }
    return randomWords.join(' ');
  }

  const [isOpen, setIsOpen] = useState(false);

  const [gameName, setGameName] = useState(generateChessLobbyName())

  const [data, setData] = useState({ setups: [] });

  const [boardState, setBoardState] = useState({ width: 8, height: 8, pieces: [] })

  const [presetName, setPresetName] = useState("")

  
  // Example usage
  const chessLobbyName = generateChessLobbyName();
  
  console.log(chessLobbyName);

  function postGameData(gameId, data) {
    console.log(data)
    fetch(`/api/game/${gameId}`, {
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

  const getRandomColor = () => {
    const colors = ['white', 'black'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const makeGame = (colour) => {
    postGameData(gameName, {time:600, increment:10, setup:presetName, host_colour:colour})
    router.push(`/game?gameName=${gameName}`)
  }

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/globals');
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
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <FancyButton onClick={openModal}>
        <span>New Game</span>
      </FancyButton>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50" />
          <div className="modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex bg-black justify-between items-center p-3 rounded-t-lg">
                <p className="text-2xl font-bold text-white">Create new game</p>
                <button
                  className="modal-close p-2 -mt-2 -mr-2 rounded-full hover:bg-green-800"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fill="currentColor"
                      d="M12.727,6 L9,9.727 L5.273,6 L4.586,6.686 L8.313,10.414 L4.586,14.141 L5.273,14.828 L9,11.101 L12.727,14.828 L13.414,14.141 L9.687,10.414 L13.414,6.686 L12.727,6 Z"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="border-4 rounded-b-lg border-black border-t-0 text-black p-4">
                <div className="flex grid grid-cols-2 space-x-4">
                  <div>
                    <input
                      type="text"
                      value={gameName}
                      onChange={(event) => { setGameName(event.target.value) }}
                      className="border border-gray-400 p-2 mb-4 w-full"
                    />
                    {Object.keys(data.setups).map((key) => {
                      const setup = data.setups[key];
                      return (
                        <div>
                          <FancyButtonPopout
                            onClick={() => { setPresetName(key); setBoardState({ width: setup.width, height: setup.height, pieces: setup.pieces }) }}
                            popoutComponent={
                              <div className="w-32">
                                <Board x={setup.width} y={setup.height} pieces={setup.pieces} />
                              </div>
                            }
                          >
                            <span>{key}</span>
                          </FancyButtonPopout>
                        </div>
                      );
                    })}


                  </div>
                  <div>
                    <div className="h-8 font-bold text-xl ml-4">{presetName}</div>
                    <Board x={boardState.width} y={boardState.height} pieces={boardState.pieces} />
                    <div className='flex justify-between mt-4'>
                      <button 
                        className="aspect-square hover:bg-[#c18557] bg-gray-900 border-4 border-black rounded-lg w-16 justify-center"
                        onClick={() => {makeGame("white")}}
                      >
                        <Image className="" src="/pieces/white/king.png" width={64} height={64} />
                      </button>
                      <button 
                        className="aspect-square hover:bg-[#c18557] bg-gray-900 border-4 border-black rounded-lg w-16 justify-center"
                        onClick={() => {makeGame(getRandomColor())}}
                      >
                        <Image className="p-1" src="/wbK.svg" width={64} height={64} />
                      </button>
                      <button 
                        className="aspect-square hover:bg-[#c18557] bg-gray-900 border-4 border-black rounded-lg w-16 justify-center"
                        onClick={() => {makeGame("black")}}
                      >
                        <Image className="" src="/pieces/black/king.png" width={64} height={64} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


