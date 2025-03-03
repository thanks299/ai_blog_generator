import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Cursor } from "@/components/cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Video to Blog Converter",
  description: "Transform YouTube videos into well-structured blog posts with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen bg-background">{children}</main>
        </ThemeProvider>
        <Cursor />
      </body>
    </html>
  )
}



import './globals.css'