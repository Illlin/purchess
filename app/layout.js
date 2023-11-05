import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

//👇 Import Open Sans font
import { Poppins } from 'next/font/google'

//👇 Configure our font object
const openSans = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '500'
})

export const metadata = {
  title: 'PURCHE$$',
  description: 'Purchess homepage',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <div className="h-screen">
          <Navbar/>
          <div className="flex justify-center">
            <div className="max-w-screen-lg w-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
