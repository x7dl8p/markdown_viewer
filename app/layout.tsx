import type React from "react"
import "./globals.css"
import "@/styles/syntax-highlighter.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Toaster from "@/components/Toaster"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Awsm MD",
  description: "A lightweight Markdown viewer + editor by mohammad.is-a.dev",
  keywords: [
    "markdown editor",
    "markdown viewer",
    "online markdown",
    "markdown to pdf",
    "markdown syntax highlighting",
    "markdown preview",
    "md editor",
    "markdown converter",
    "free markdown editor",
    "markdown tools"
  ],
  authors: [{ name: "Mohammad", url: "https://mohammad.is-a.dev" }],
  creator: "Mohammad",
  publisher: "Mohammad",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://awsm-md.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Awsm MD - Free Online Markdown Editor & Viewer",
    description: "Create, edit, and preview Markdown documents with syntax highlighting. Export to PDF, HTML, and MD formats.",
    url: "https://awsm-md.vercel.app",
    siteName: "Awsm MD",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Awsm MD - Markdown Editor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awsm MD - Free Online Markdown Editor & Viewer",
    description: "Create, edit, and preview Markdown documents with syntax highlighting. Export to PDF, HTML, and MD formats.",
    images: ["/placeholder-logo.png"],
    creator: "@d3v_mohammad",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/placeholder-logo.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Awsm MD",
              "description": "A lightweight Markdown viewer and editor with syntax highlighting and export capabilities",
              "url": "https://awsm-md.vercel.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Mohammad",
                "url": "https://mohammad.is-a.dev"
              },
              "featureList": [
                "Real-time Markdown preview",
                "Syntax highlighting",
                "PDF export",
                "HTML export",
                "Dark/Light theme support",
                "Responsive design"
              ],
              "screenshot": "/placeholder-logo.png"
            })
          }}
        />
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
