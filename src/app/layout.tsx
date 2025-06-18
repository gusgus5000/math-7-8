import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MathMinds | Interactive Mathematics Learning for Grades 7-8',
  description: 'MathMinds - Engaging mathematics learning platform for 7th and 8th grade students. Master algebra, geometry, and problem-solving with interactive lessons and real-time feedback.',
  keywords: 'math, mathematics, grade 7, grade 8, education, learning, practice problems, study guide, MathMinds',
  authors: [{ name: 'Aiden' }],
  creator: 'Aiden',
  publisher: 'MathMinds',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MathMinds - Math Learning for Grades 7-8',
    description: 'Engaging mathematics learning platform for 7th and 8th grade students',
    url: 'https://math-7-8.vercel.app',
    siteName: 'MathMinds',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathMinds - Math Learning for Grades 7-8',
    description: 'Engaging mathematics learning platform for 7th and 8th grade students',
    creator: '@yourtwitterhandle',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://math-7-8.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <AuthProvider>
          <SubscriptionProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
              Skip to main content
            </a>
            <div id="main-content">
              {children}
            </div>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}