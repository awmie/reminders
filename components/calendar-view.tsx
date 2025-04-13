"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks } from "@/contexts/task-context"

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "year">("month")
  const { tasks } = useTasks()

  // Get the current date to highlight it
  const today = new Date()

  // Calculate task data for calendar display
  const getTaskDataForDate = (dateString: string) => {
    const dateTasks = tasks[dateString] || []
    if (dateTasks.length === 0) return null

    const completed = dateTasks.filter((task) => task.completed).length
    return {
      total: dateTasks.length,
      completed,
    }
  }

  // Functions to navigate between months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))
  }

  const nextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Format date as YYYY-MM-DD for links and data lookup
  const formatDateForLink = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1" />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = formatDateForLink(date)
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

      const taskData = getTaskDataForDate(dateString)

      days.push(
        <Link
          href={`/${dateString}`}
          key={day}
          className={cn(
            "group h-24 rounded-xl border p-1 transition-all hover:border-primary hover:shadow-sm",
            isToday ? "border-primary bg-primary/5" : "border-border",
          )}
        >
          <div className="flex h-full flex-col p-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                isToday ? "bg-primary text-primary-foreground" : "text-foreground group-hover:bg-primary/10",
              )}
            >
              {day}
            </span>

            {taskData && (
              <div className="mt-auto">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(taskData.completed / taskData.total) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {taskData.completed}/{taskData.total} tasks
                </p>
              </div>
            )}
          </div>
        </Link>,
      )
    }

    return days
  }

  // Generate months for year view
  const generateYearMonths = () => {
    const year = currentMonth.getFullYear()
    const months = []

    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      // Count tasks for this month
      let totalTasks = 0
      let completedTasks = 0

      // Get the number of days in this month
      const daysInMonth = getDaysInMonth(year, month)

      // Check each day of the month for tasks
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const dateTasks = tasks[dateString] || []

        totalTasks += dateTasks.length
        completedTasks += dateTasks.filter((task) => task.completed).length
      }

      // Create visual indicators for the month
      const hasData = totalTasks > 0

      months.push(
        <div key={month} className="rounded-xl border p-4 hover:border-primary hover:shadow-sm transition-all">
          <button
            onClick={() => {
              setCurrentMonth(new Date(year, month, 1))
              setViewMode("month")
            }}
            className="w-full text-left"
          >
            <h3 className="font-medium mb-2">{monthName}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-1 w-full bg-muted rounded-full" />
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("h-1 w-full rounded-full", hasData && i % 7 === 3 ? "bg-primary/30" : "bg-muted")}
                />
              ))}
            </div>
            {hasData && (
              <div className="mt-2 text-xs text-muted-foreground">
                {completedTasks}/{totalTasks} tasks
              </div>
            )}
          </button>
        </div>,
      )
    }

    return months
  }

  // Get month and year display
  const monthYearDisplay = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Get years for dropdown
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">
            {viewMode === "month" ? monthYearDisplay : currentMonth.getFullYear()}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
            className="ml-2"
          >
            {viewMode === "month" ? "Year View" : "Month View"}
          </Button>
        </div>
        <div className="flex gap-1">
          {viewMode === "month" ? (
            <>
              <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={prevYear} className="rounded-full">
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">Previous year</span>
              </Button>
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={(value) => {
                  setCurrentMonth(new Date(Number.parseInt(value), currentMonth.getMonth(), 1))
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={nextYear} className="rounded-full">
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Next year</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {viewMode === "month" && (
        <>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">{generateCalendarDays()}</div>
        </>
      )}

      {viewMode === "year" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {generateYearMonths()}
        </div>
      )}
    </div>
  )
}
