import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/contexts/task-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Productivity App",
  description: "A clean, elegant productivity app with calendar and task management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="glass-bg"></div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TaskProvider>{children}</TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'