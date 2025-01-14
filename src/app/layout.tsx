import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { NotificationProvider } from '@/context/NotificationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Egreso App',
  description: 'App de Egresos para lo Fierro'
}

interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NotificationProvider>
          <main>{children}</main>
        </NotificationProvider>
      </body>
    </html>
  )
}
