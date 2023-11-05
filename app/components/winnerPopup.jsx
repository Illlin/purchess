"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Winner ( { winner }) {
    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    const handleInputChange = (e) => {
        setTyping(e.target.value);
    };

    const setCookie = () => {
        setUsername(typing)
        
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);

        document.cookie = `user=${typing};expires=${expires.toUTCString()};path=/`;

        document.cookie = `username=${typing}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;
        closeModal();
    };

    return (
      <div>
        {winner != "none" && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay fixed inset-0 bg-black opacity-50" />
            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex bg-black justify-between items-center p-3 rounded-t-lg">
                  <p className="text-2xl font-bold text-white">Congratulations {winner}</p>
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
                <div className="border-4 rounded-b-lg border-black border-t-0 justify-center items-center text-black p-4 w-full flex grid grid-cols-1">
                    <div className="justify-center items-center flex w-full mb-4">
                        <Image className="" src={`/pieces/${winner}/king.png`} width={100} height={100}/>
                    </div>
                    
                  <Link className="w-full px-2 text-white text-center bg-gray-900 border-4 border-black rounded-full" href="/"> Go Home </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}