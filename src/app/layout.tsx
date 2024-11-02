import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookends',
  description: 'Your personal library, reading goals, and progress tracker in one place',
  icons: {
    icon: 'favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 
