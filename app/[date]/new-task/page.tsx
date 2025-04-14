"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useTasks } from "@/contexts/task-context"

export default function NewTaskPage({ params }: { params: { date: string } }) {
  const router = useRouter()
  const { addTask } = useTasks()
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")

  // Format the date from URL parameter (e.g., "2023-04-15" to "April 15, 2023")
  const formattedDate = new Date(params.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // For mobile, create a shorter date format
  const shortFormattedDate = new Date(params.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (taskName.trim() !== "") {
      // Add the new task using our context
      addTask(params.date, taskName, taskDescription || undefined)

      // Navigate back to the day view
      router.push(`/${params.date}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 sm:h-16 items-center px-4 sm:px-6">
          <Link href={`/${params.date}`}>
            <Button variant="ghost" size="icon" className="mr-2 rounded-full h-8 w-8 sm:h-9 sm:w-9">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-base sm:text-xl font-semibold truncate">
            <span className="hidden sm:inline">New Task for {formattedDate}</span>
            <span className="sm:hidden">New Task ({shortFormattedDate})</span>
          </h1>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Add Task</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Create a new task for {formattedDate}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="task-name" className="text-xs sm:text-sm font-medium">
                    Task Name
                  </label>
                  <Input
                    id="task-name"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                    className="h-9 sm:h-10 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="task-description" className="text-xs sm:text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="task-description"
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={4}
                    className="text-sm sm:text-base"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 sm:pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="text-xs sm:text-sm h-8 sm:h-10"
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-xs sm:text-sm h-8 sm:h-10 bg-today hover:bg-today/90">
                  Add Task
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
