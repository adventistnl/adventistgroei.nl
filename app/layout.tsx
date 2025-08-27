import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import { PageProvider } from "@/contexts/page-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "SDA Church Management System",
  description: "Comprehensive church management platform for Seventh-day Adventist churches",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <PageProvider>
            {children}
          </PageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
