"use client"

import { CalendarView } from "@/components/calendar-view"
import { ModeToggle } from "@/components/mode-toggle"
import { useState, useEffect } from "react"

export default function Home() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Format today's date as YYYY-MM-DD
    const today = new Date()
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    setCurrentDate(formattedDate)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 glass-header">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <h1 className="text-lg sm:text-xl font-semibold">Productivity</h1>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="glass-panel p-4 sm:p-6">
          <CalendarView />
        </div>
      </main>
    </div>
  )
}
