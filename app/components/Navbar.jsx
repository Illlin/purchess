import Image from 'next/image'
import Login from './Login'
import Link from 'next/link'

export default function Navbar({ children }) {
    return (
        <div className="w-full h-16 bg-black flex justify-between">
            <Link href="/">
                <span
                    className="text-4xl flex font-bold ml-4 self-center text-white"
                >
                    <span>
                        <Image
                            src="/logo.webp"
                            width={64}
                            height={64}
                            alt="PurChe$$ logo"
                        />
                    </span>
                    <span className="self-center">
                        PURCHE<span className="text-green-600">$$</span>
                    </span>



                </span>
            </Link>
            <span className="text-white self-center mr-6">
                <Login />
            </span>
        </div>
    )
}
