import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <div className="grid grid-cols-2 w-full">
        <div className="m-4">
          <div 
            className="text-white text-left border-2 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            Join Game
          </div>
          <div 
            className="text-white text-left border-2 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            New Game
          </div>
          <div 
            className="text-white text-left border-2 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            Against AI
          </div>
          <div>
            <span> 0 Players online 0 Players in game</span>
          </div>
          <div className="border-4 border-black bg-yellow-200 rounded-lg">
            aaa
          </div>
          
        </div>
        <div className="m-4">
          <div className="grid grid-cols-2 w-full">
            <div>
              <div className="text-xl font-bold">Piece of the Day:</div>
              <div className="font-bold text-lg"> KNook </div>
              <div><span className="font-bold">Price:</span> <span className="rounded-full bg-gray-900 border-black px-2 text-white">$100</span></div>
              <div className="">
                The Nook, combine the power of the Rook and the versatility of the knight
              </div>
            </div>
            <div>
              <Image 
                src="/Knook.png"
                width={256}
                height={256}
                alt="Knook"
              />
            </div>
          </div>
          <div className="border-4 border-black bg-yellow-200 rounded-lg">
            bbb
          </div>
        </div>
      </div>
    </main>
  )
}
