import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Media Studio — Professional AI Video & Photo Generation',
  description:
    'Transform your creative vision into stunning AI-generated videos and photos. Describe what you want, pay once, receive your media by email.',
  openGraph: {
    title: 'AI Media Studio',
    description: 'Professional AI video & photo generation, delivered to your inbox.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
