import {ClerkProvider} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { dark } from "@clerk/themes";
import '../globals.css'

import Topbar from '../../components/shared/Topbar'
import LeftSidebar from '../../components/shared/LeftSidebar'
import RightSidebar from '../../components/shared/RightSidebar'
import Bottombar from '../../components/shared/Bottombar'


export const metadata = {
  title:'Threads',
  description:'A nextJS13 meta thread Application Clone',
  icons: {
    icon: '/assets/logo.svg',
  },
}

const inner = Inter({ subsets: ['latin']});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inner.className}`}>
          <Topbar/>
          <main className='flex flex-row'>
            <LeftSidebar/>
            <section className='flex min-h-screen flex-1 flex-col items-center bg-black px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            <RightSidebar/>
          </main>
          <Bottombar/>
          </body>
      </html>
    </ClerkProvider>
  )
}
