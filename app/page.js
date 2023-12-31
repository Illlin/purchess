import Image from 'next/image'
import Board from './components/Board'
import FancyButton from './components/Button'
import GameMaker from './components/GameMaker'
import JoinGame from './components/gameJoiner'

export default function Home() {
  console.log("Fish?!")
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        <div className="m-4">
          
          <JoinGame codes={}/>
          <GameMaker />
          <FancyButton>
          <span>Against AI <span className="ml-2 text-xs">powered by</span><Image className="inline-block ml-2" src="/Intel.png" width={32} height={32}></Image></span>
          </FancyButton>

          <div className="flex justify-between mx-4">
            <span className=""> <a className="font-bold">8</a> Players online </span>
            <span className="text-right"> <a className="font-bold">2</a> Players in game </span>
          </div>
          <div className="w-full border-4 border-black mt-2">
            <Board 
              x={8} 
              y={8} 
              pieces={[
                {"x":0, "y":0, "type":"Knook", "colour":"Black"},
                {"x":1, "y":0, "type":"Knight", "colour":"Black"},
                {"x":2, "y":0, "type":"Bishop", "colour":"Black"},
                {"x":3, "y":0, "type":"Queen", "colour":"Black"},
                {"x":4, "y":0, "type":"King", "colour":"Black"},
                {"x":5, "y":0, "type":"Bishop", "colour":"Black"},
                {"x":6, "y":0, "type":"Knight", "colour":"Black"},
                {"x":7, "y":0, "type":"Rook", "colour":"Black"},
                {"x":0, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":1, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":2, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":3, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":4, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":5, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":6, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":7, "y":1, "type":"Pawn", "colour":"Black"},
                {"x":0, "y":6, "type":"Pawn", "colour":"White"},
                {"x":1, "y":6, "type":"Pawn", "colour":"White"},
                {"x":2, "y":6, "type":"Pawn", "colour":"White"},
                {"x":3, "y":6, "type":"Pawn", "colour":"White"},
                {"x":4, "y":6, "type":"Pawn", "colour":"White"},
                {"x":5, "y":6, "type":"Pawn", "colour":"White"},
                {"x":6, "y":6, "type":"Pawn", "colour":"White"},
                {"x":7, "y":6, "type":"Pawn", "colour":"White"},
                {"x":0, "y":7, "type":"Rook", "colour":"White"},
                {"x":1, "y":7, "type":"Knight", "colour":"White"},
                {"x":2, "y":7, "type":"Bishop", "colour":"White"},
                {"x":3, "y":7, "type":"Queen", "colour":"White"},
                {"x":4, "y":7, "type":"King", "colour":"White"},
                {"x":5, "y":7, "type":"Bishop", "colour":"White"},
                {"x":6, "y":7, "type":"Knight", "colour":"White"},
                {"x":7, "y":7, "type":"Rook", "colour":"White"}
            ]}
            />
          </div>
          
          
        </div>
        <div className="m-4">
          <div className="border-4 border-b-0 rounded-t-lg border-black text-xl font-bold pl-2 text-center bg-gray-900 text-white">Piece of the Day</div>
          <div className="grid grid-cols-2 w-full border-black border-4 rounded-b-lg p-2 mb-4 bg-yellow-100">
            <div>
              
              <div className="font-bold text-lg"> Knook </div>
              <div><span className="font-bold">Price:</span> <span className="rounded-full bg-gray-900 border-black px-2 text-white">$100</span></div>
              <div className="">
                The Knook, combine the power of the Rook and the versatility of the knight
              </div>
            </div>
            <div>
              <Image 
                src="/pieces/knook.png"
                width={256}
                height={256}
                alt="Knook"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
