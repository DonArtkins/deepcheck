import type React from "react"
import type { Metadata } from "next"
import { Roboto_Mono, Orbitron } from "next/font/google"
import "./globals.css"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "DeepCheck",
  description: "Advanced AI-powered deepfake detection and media authenticity verification",
  keywords: "deepfake, detection, AI, security, media verification",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${orbitron.variable} dark antialiased`}>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  )
}
