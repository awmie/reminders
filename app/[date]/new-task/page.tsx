"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useTasks } from "@/contexts/task-context"

export default function NewTaskPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { addTask } = useTasks()
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [formattedDate, setFormattedDate] = useState("Unknown Date")

  // Extract date from pathname
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/\/([^/]+)\/new-task/)
      if (match && match[1]) {
        const extractedDate = match[1]
        setDateStr(extractedDate)
        
        try {
          if (extractedDate && extractedDate !== "undefined") {
            const date = new Date(extractedDate)
            // Check if date is valid before formatting
            if (!isNaN(date.getTime())) {
              setFormattedDate(date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }))
            }
          }
        } catch (error) {
          console.error("Error formatting date:", error)
        }
      }
    }
  }, [pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (taskName.trim() !== "") {
      // Add the new task using our context
      addTask(dateStr, taskName, taskDescription || undefined)

      // Navigate back to the day view
      router.push(`/${dateStr}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-6">
          <Link href={`/${dateStr}`}>
            <Button className="mr-2 rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">New Task</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Add Task</CardTitle>
              <CardDescription>Create a new task for {formattedDate}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="task-name" className="text-sm font-medium">
                    Task Name
                  </label>
                  <Input
                    id="task-name"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="task-description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="task-description"
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Add Task</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
