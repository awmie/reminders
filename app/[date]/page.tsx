"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { TaskList } from "@/components/task-list"
import { DailySummary } from "@/components/daily-summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Plus, X } from "lucide-react"
import { useTasks } from "@/contexts/task-context"

export default function DayPage() {
  const params = useParams()
  const dateString = typeof params.date === 'string' ? params.date : Array.isArray(params.date) ? params.date[0] : ''
  
  const { addTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")

  // Format the date from URL parameter (e.g., "2023-04-15" to "April 15, 2023")
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // For mobile, create a shorter date format
  const shortFormattedDate = new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      addTask(dateString, newTaskText)
      setNewTaskText("")
      setShowTaskForm(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 glass-header">
        <div className="flex h-14 sm:h-16 items-center px-4 sm:px-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 rounded-full h-8 w-8 sm:h-9 sm:w-9">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-base sm:text-xl font-semibold truncate">
            <span className="hidden sm:inline">{formattedDate}</span>
            <span className="sm:hidden">{shortFormattedDate}</span>
          </h1>
          <div className="ml-auto">
            <Button
              size="sm"
              className="rounded-full h-8 text-xs sm:text-sm bg-today hover:bg-today/90"
              onClick={() => setShowTaskForm(true)}
            >
              <Plus className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-4 sm:space-y-8">
          {showTaskForm && (
            <div className="glass-panel p-3 sm:p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm sm:text-base">New Task</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => setShowTaskForm(false)}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task name"
                  className="h-8 sm:h-9 text-sm rounded-xl"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 sm:h-9 bg-today hover:bg-today/90 text-xs sm:text-sm rounded-xl"
                >
                  Add
                </Button>
              </form>
            </div>
          )}
          <div className="glass-panel p-4 sm:p-6">
            <TaskList date={dateString} />
          </div>
          <div className="glass-panel p-4 sm:p-6">
            <DailySummary date={dateString} />
          </div>
        </div>
      </main>
    </div>
  )
}
