"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  action: () => void
}

export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).isContentEditable
    ) {
      return
    }

    for (const shortcut of shortcuts) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.altKey === !!shortcut.altKey &&
        !!event.shiftKey === !!shortcut.shiftKey
      ) {
        event.preventDefault()
        shortcut.action()
        break
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

// Create a type for task form control
export type TaskFormControl = {
  showTaskForm: boolean;
  setShowTaskForm: (show: boolean) => void;
}

export function useTaskShortcuts(formControl?: TaskFormControl) {
  const router = useRouter()

  useKeyboardShortcut([
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // If we have form control, use it to show the form directly
        if (formControl) {
          formControl.setShowTaskForm(true)
        } else {
          // If no form control is provided (we're not on a date page),
          // navigate to today's date page
          const today = new Date().toISOString().split('T')[0]
          router.push(`/${today}`)
        }
      }
    }
  ])
}