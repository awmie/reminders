"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTaskShortcuts, TaskFormControl } from "@/hooks/use-keyboard-shortcut"

interface KeyboardShortcutsProps {
  formControl?: TaskFormControl;
}

export function KeyboardShortcuts({ formControl }: KeyboardShortcutsProps) {
  const pathname = usePathname()
  const [currentDate, setCurrentDate] = useState<string | undefined>(undefined)
  
  // Extract date from path if it's in format /{date} or /{date}/...
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const potentialDate = pathParts[0]
      // Simple date validation (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(potentialDate)) {
        setCurrentDate(potentialDate)
      } else {
        setCurrentDate(undefined)
      }
    } else {
      setCurrentDate(undefined)
    }
  }, [pathname])

  // Apply keyboard shortcuts with form control if available
  useTaskShortcuts(formControl)
  
  return null // This is a non-visual component
}