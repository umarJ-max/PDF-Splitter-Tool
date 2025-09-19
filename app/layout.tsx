import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF Splitter Tool - Split PDFs Online | Umar J Dev',
  description: 'Free online PDF splitter tool to split large PDFs into smaller parts. Fast, secure, and easy to use. Process files locally in your browser with no uploads required.',
  keywords: 'PDF splitter, split PDF, PDF tools, online PDF, document splitter, free PDF tools',
  authors: [{ name: 'Umar J', url: 'https://github.com/umarj' }],
  creator: 'Umar J Dev',
  publisher: 'Umar J Dev',
  robots: 'index, follow',
  openGraph: {
    title: 'PDF Splitter Tool - Split PDFs Online',
    description: 'Free online PDF splitter tool. Fast, secure, and easy to use.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Splitter Tool - Split PDFs Online',
    description: 'Free online PDF splitter tool. Fast, secure, and easy to use.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}