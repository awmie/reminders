"use client"

import { useState, useEffect } from "react"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTasks } from "@/contexts/task-context"

export function TaskList({ date }: { date: string }) {
  const { tasks, toggleTask, deleteTask } = useTasks()
  const [isLoading, setIsLoading] = useState(true)
  const [dateTasks, setDateTasks] = useState([])

  useEffect(() => {
    // Simulate loading data for the specific date
    setIsLoading(true)
    setTimeout(() => {
      setDateTasks(tasks[date] || [])
      setIsLoading(false)
    }, 300)
  }, [date, tasks])

  if (isLoading) {
    return (
      <div className="space-y-1">
        <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
      <ul className="space-y-2">
        {dateTasks.map((task) => (
          <li key={task.id} className="group">
            <div
              className={cn(
                "flex items-center rounded-lg border p-3 transition-all",
                task.completed
                  ? "border-muted bg-muted/50"
                  : "border-border hover:border-primary/30 hover:bg-primary/5",
              )}
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "mr-3 h-6 w-6 shrink-0 rounded-full border p-0 transition-all",
                  task.completed ? "border-primary bg-primary text-primary-foreground" : "border-input",
                )}
                onClick={() => toggleTask(task.id)}
              >
                <Check className={cn("h-3 w-3 transition-opacity", task.completed ? "opacity-100" : "opacity-0")} />
                <span className="sr-only">Mark as {task.completed ? "incomplete" : "complete"}</span>
              </Button>
              <div className="flex-1">
                <span
                  className={cn(
                    "transition-all",
                    task.completed ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  {task.text}
                </span>
                {task.description && <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {dateTasks.length === 0 && (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No tasks for this day</p>
        </div>
      )}
    </div>
  )
}
