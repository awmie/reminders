"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks } from "@/contexts/task-context"
import { useMediaQuery } from "@/hooks/use-media-query"

export function CalendarView() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [viewMode, setViewMode] = useState<"month" | "year">("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { tasks } = useTasks()
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Format today's date as YYYY-MM-DD
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`

  // Set selected date to today on initial load
  useEffect(() => {
    setSelectedDate(todayFormatted)
    // Ensure the calendar is showing the current month that contains today's date
    goToToday()
  }, [])

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

  // Go to today
  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(todayFormatted)
    if (viewMode === "year") {
      setViewMode("month")
    }
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0",
    )}`
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
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-24 p-1" />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = formatDateForLink(date)
      const isToday = dateString === todayFormatted
      const isSelected = dateString === selectedDate

      const taskData = getTaskDataForDate(dateString)

      days.push(
        <Link
          href={`/${dateString}`}
          key={day}
          onClick={(e) => {
            setSelectedDate(dateString)
          }}
          className={cn(
            "group flex items-center justify-center calendar-day",
            isMobile ? "h-10" : "h-24 rounded-2xl border p-1 transition-all hover:shadow-sm",
            !isMobile && isToday
              ? "border-today bg-today/5 hover:border-today is-today"
              : !isMobile && isSelected
                ? "border-primary bg-primary/5 hover:border-primary is-selected"
                : !isMobile && "border-border hover:border-primary/30",
          )}
          onMouseMove={(e) => {
            // Only apply effect on desktop
            if (isMobile) return;
            
            // Get reference to the glow element
            const element = e.currentTarget;
            const glowEl = element.querySelector('.mouse-glow') as HTMLDivElement;
            
            if (!glowEl) return;
            
            // Get the position within the element
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Add delay to the movement with increased delay time
            glowEl.style.transition = 'opacity 0.4s, transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
            glowEl.style.opacity = '1';
            glowEl.style.left = `${x}px`;
            glowEl.style.top = `${y}px`;
          }}
          onMouseEnter={(e) => {
            // Only apply effect on desktop
            if (isMobile) return;
            
            const element = e.currentTarget;
            
            // Create glow element if it doesn't exist
            if (!element.querySelector('.mouse-glow')) {
              const glowEl = document.createElement('div');
              glowEl.className = 'mouse-glow';
              element.appendChild(glowEl);
            }
            
            const glowEl = element.querySelector('.mouse-glow') as HTMLDivElement;
            glowEl.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            // Only apply effect on desktop
            if (isMobile) return;
            
            const glowEl = e.currentTarget.querySelector('.mouse-glow') as HTMLDivElement;
            if (glowEl) {
              glowEl.style.opacity = '0';
            }
          }}
        >
          {isMobile ? (
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium relative",
                isToday
                  ? "bg-today text-today-foreground"
                  : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                taskData && "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full",
                taskData && isToday ? "after:bg-today" : taskData && "after:bg-primary",
              )}
            >
              {day}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col p-1 sm:p-2 relative z-1">
              <span
                className={cn(
                  "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-sm font-medium",
                  isToday
                    ? "bg-today text-today-foreground"
                    : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground group-hover:bg-primary/10",
                )}
              >
                {day}
              </span>

              {taskData && (
                <div className="mt-auto relative z-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full transition-all", isToday ? "bg-today" : "bg-primary")}
                      style={{ width: `${(taskData.completed / taskData.total) * 100}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
                    {taskData.completed}/{taskData.total}
                  </p>
                </div>
              )}
            </div>
          )}
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
      const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

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
        <div
          key={month}
          className={cn(
            isMobile
              ? "flex flex-col items-center justify-center p-2"
              : "rounded-2xl border p-3 sm:p-4 hover:shadow-sm transition-all",
            !isMobile && isCurrentMonth
              ? "border-today bg-today/5 hover:border-today"
              : !isMobile && "hover:border-primary",
          )}
        >
          <button
            onClick={() => {
              setCurrentMonth(new Date(year, month, 1))
              setViewMode("month")
            }}
            className={cn("w-full text-left", isMobile && "flex flex-col items-center")}
          >
            <h3 className={cn("font-medium mb-1", isCurrentMonth ? "text-today" : "", isMobile && "text-sm")}>
              {monthName}
            </h3>

            {isMobile ? (
              hasData && (
                <span className="text-xs text-muted-foreground">
                  {completedTasks}/{totalTasks}
                </span>
              )
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-1 w-full bg-muted rounded-full" />
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 w-full rounded-full",
                        hasData && i % 7 === 3 ? (isCurrentMonth ? "bg-today/50" : "bg-primary/30") : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                {hasData && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks
                  </div>
                )}
              </>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">
            {viewMode === "month" ? monthYearDisplay : currentMonth.getFullYear()}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
            className="ml-2 text-xs sm:text-sm rounded-xl"
          >
            {viewMode === "month" ? "Year View" : "Month View"}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm rounded-xl">
            Today
          </Button>
          {viewMode === "month" ? (
            <>
              <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full h-8 w-8">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={prevYear} className="rounded-full h-8 w-8">
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">Previous year</span>
              </Button>
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={(value) => {
                  setCurrentMonth(new Date(Number.parseInt(value), currentMonth.getMonth(), 1))
                }}
              >
                <SelectTrigger className="w-[80px] sm:w-[100px] h-8 text-xs sm:text-sm rounded-xl">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={nextYear} className="rounded-full h-8 w-8">
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Next year</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {viewMode === "month" && (
        <>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">{generateCalendarDays()}</div>
        </>
      )}

      {viewMode === "year" && (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">{generateYearMonths()}</div>
      )}
    </div>
  )
}
