"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useTasks } from "@/contexts/task-context"

export function DailySummary({ date }: { date: string }) {
  const { tasks } = useTasks()
  const [summary, setSummary] = useState({
    completed: 0,
    total: 0,
    focusTime: 0, // minutes
  })

  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Calculate summary based on tasks for this date
    setIsLoading(true)
    setTimeout(() => {
      const dateTasks = tasks[date] || []
      const completed = dateTasks.filter((task) => task.completed).length
      const total = dateTasks.length

      // In a real app, focus time would come from a time tracking feature
      // Here we're just generating a random value based on the number of completed tasks
      const focusTime = completed * 30 + Math.floor(Math.random() * 30)

      setSummary({
        completed,
        total,
        focusTime,
      })
      setIsLoading(false)
    }, 300)
  }, [date, tasks])

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(summary.total > 0 ? (summary.completed / summary.total) * 100 : 0)
    }, 100)
    return () => clearTimeout(timer)
  }, [summary.completed, summary.total])

  // Format focus time
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Daily Summary</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="h-4 bg-muted/50 rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="h-20 sm:h-24 bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-20 sm:h-24 bg-muted/50 rounded-xl animate-pulse" />
          </div>
          <div className="h-20 sm:h-24 bg-muted/50 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Daily Summary</h2>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Task Completion</span>
            <span className="font-medium">
              {summary.completed}/{summary.total}
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-today/10">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-today" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
              <p className="text-xl sm:text-2xl font-semibold">{summary.completed}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-muted">
              <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Remaining</p>
              <p className="text-xl sm:text-2xl font-semibold">{summary.total - summary.completed}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-muted">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Focus Time</p>
            <p className="text-xl sm:text-2xl font-semibold">{formatFocusTime(summary.focusTime)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
