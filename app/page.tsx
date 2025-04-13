"use client"

import Link from "next/link"
import { CalendarView } from "@/components/calendar-view"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Productivity</h1>
          <div className="flex items-center gap-2">
            {currentDate && (
              <Link href={`/${currentDate}/new-task`}>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Add new task</span>
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <CalendarView />
      </main>
    </div>
  )
}
