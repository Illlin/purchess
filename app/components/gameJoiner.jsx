"use client"

import Image from 'next/image'
import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Board from './Board';
import FancyButton from './Button';
import FancyButtonPopout from './FancyButtonPopout';
import Link from 'next/link';



export default function JoinGame( { codes } ) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({ setups: [] });

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
        <span>Join Game</span>
      </FancyButton>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50" />
          <div className="modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex bg-black justify-between items-center p-3 rounded-t-lg">
                <p className="text-2xl font-bold text-white">Join Game</p>
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
              {data.game_codes.map((key) => (
                <div className="w-full bg-gray-900 border-4 border-black rounded-full text-white pl-2 mb-1" key={key}>
                    <Link href={`/game?gameName=${key}`}>{key}</Link>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


