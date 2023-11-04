import Image from 'next/image'
import Board from './components/Board'

export default function Home() {
  console.log("Fish?!")
  return (
    <main>
      <div className="grid grid-cols-2 w-full">
        <div className="m-4">
          <div 
            className="text-white text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            Join Game
          </div>
          <div 
            className="text-white text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            New Game
          </div>
          <div 
            className="text-white text-left border-4 rounded-full p-2 mb-1 bg-gray-900 hover:bg-purple-700 border-black"
          >
            <span>Against AI <span className="ml-2 text-xs">powered by</span><Image className="inline-block ml-2" src="/Intel.png" width={32} height={32}></Image></span>
          </div>
          <div>
            <span> <a className="font-bold">0</a> Players online <a className="font-bold">0</a> Players in game</span>
          </div>
          <div className="border-4 border-black bg-amber-100 rounded-lg">
            aaa
          </div>
          <div className="w-full border-4 border-black mt-4 rounded-lg">
            <Board x={8} y={6}/>
          </div>
          
          
        </div>
        <div className="m-4">
          <div className="border-4 border-b-0 rounded-t-lg border-black text-xl font-bold pl-2 text-center bg-gray-900 text-white">Piece of the Day</div>
          <div className="grid grid-cols-2 w-full border-black border-4 rounded-b-lg p-2 mb-4 bg-yellow-100">
            <div>
              
              <div className="font-bold text-lg"> Knook </div>
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
          <div className="border-4 border-black bg-amber-100 rounded-lg">
            bbb
          </div>
        </div>
      </div>
    </main>
  )
}
