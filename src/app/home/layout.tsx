import Navbar from '@/components/navbar/Navbar'
import { NotificationProvider } from '@/context/NotificationContext'
interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <Navbar />
      <div>{children}</div>
    </main>
  )
}
