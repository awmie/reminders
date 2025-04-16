"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

// Type for task data with proper typing
export interface Task {
  id: number
  text: string
  description?: string
  completed: boolean
  date: string
}

interface TaskContextType {
  tasks: Record<string, Task[]>
  addTask: (date: string, text: string, description?: string) => void
  toggleTask: (taskId: number) => void
  deleteTask: (taskId: number) => Promise<boolean> // Return promise to confirm deletion success
  getTasksForDate: (date: string) => Task[] // New helper function
  moveTaskToNextDay: (taskId: number) => Promise<boolean> // New function to move tasks
}

// Sample initial task data
const initialTasksData: Record<string, Task[]> = {
  "2023-04-10": [
    { id: 1, text: "Review project proposal", completed: false, date: "2023-04-10" },
    { id: 2, text: "Prepare presentation", completed: false, date: "2023-04-10" },
  ],
  "2023-04-15": [
    { id: 3, text: "Send weekly report", completed: true, date: "2023-04-15" },
    { id: 4, text: "Schedule interviews", completed: false, date: "2023-04-15" },
  ],
  "2023-04-20": [{ id: 5, text: "Update website content", completed: true, date: "2023-04-20" }],
}

const STORAGE_KEY = "productivityTasks"
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Helper for secure local storage operations
const secureStorage = {
  get: (): Record<string, Task[]> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return {}
      
      // Validate data structure before returning
      const parsedData = JSON.parse(data)
      if (typeof parsedData !== 'object' || parsedData === null) return {}
      
      return parsedData
    } catch (error) {
      console.error("Error retrieving tasks:", error)
      return {}
    }
  },
  
  set: (data: Record<string, Task[]>): void => {
    try {
      const serializedData = JSON.stringify(data)
      localStorage.setItem(STORAGE_KEY, serializedData)
    } catch (error) {
      console.error("Error saving tasks:", error)
    }
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Record<string, Task[]>>(initialTasksData)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load tasks from localStorage on initial render with better error handling
  useEffect(() => {
    try {
      const storedTasks = secureStorage.get()
      if (Object.keys(storedTasks).length > 0) {
        setTasks(storedTasks)
      }
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save tasks to localStorage whenever they change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      secureStorage.set(tasks)
    }
  }, [tasks, isInitialized])

  // Generate a unique ID for new tasks with conflict prevention
  const generateId = useCallback(() => {
    const allTasks = Object.values(tasks).flat()
    const maxId = allTasks.length > 0 ? Math.max(...allTasks.map(task => task.id)) : 0
    return maxId + 1
  }, [tasks])

  // Add a new task - optimized with useCallback for stability
  const addTask = useCallback((date: string, text: string, description?: string) => {
    if (!text.trim()) return
    
    const sanitizedText = text.trim() // Sanitize input
    
    const newTask: Task = {
      id: generateId(),
      text: sanitizedText,
      description: description?.trim(),
      completed: false,
      date,
    }

    setTasks(prevTasks => {
      const dateTasks = prevTasks[date] || []
      return {
        ...prevTasks,
        [date]: [...dateTasks, newTask],
      }
    })
  }, [generateId])

  // Toggle task completion - optimized with useCallback
  const toggleTask = useCallback((taskId: number) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }
      let updated = false

      // Find and update the task
      for (const date in newTasks) {
        const taskIndex = newTasks[date].findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          newTasks[date] = newTasks[date].map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
          updated = true
          break
        }
      }

      return updated ? newTasks : prevTasks
    })
  }, [])

  // Delete a task - optimized with useCallback and Promise for confirmation
  const deleteTask = useCallback(async (taskId: number): Promise<boolean> => {
    let success = false
    
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }
      
      // Find and remove the task
      for (const date in newTasks) {
        const taskIndex = newTasks[date].findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          newTasks[date] = newTasks[date].filter(task => task.id !== taskId)
          success = true
          break
        }
      }
      
      return success ? newTasks : prevTasks
    })
    
    return Promise.resolve(success)
  }, [])

  // Get tasks for a specific date - optimized with memoization
  const getTasksForDate = useCallback((date: string): Task[] => {
    return tasks[date] || []
  }, [tasks])

  // Move task to the next day - optimized with useCallback and Promise for confirmation
  const moveTaskToNextDay = useCallback(async (taskId: number): Promise<boolean> => {
    let success = false;
    let isCompleted = false;

    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }
      let taskToMove: Task | undefined;

      // Find the task to move
      for (const date in newTasks) {
        const taskIndex = newTasks[date].findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          taskToMove = newTasks[date][taskIndex]
          
          // Check if task is completed - if so, don't move it
          if (taskToMove.completed) {
            isCompleted = true;
            return prevTasks; // Return unchanged tasks if completed
          }
          
          newTasks[date] = newTasks[date].filter(task => task.id !== taskId)
          break
        }
      }

      if (taskToMove && !isCompleted) {
        const currentDate = new Date(taskToMove.date)
        const nextDate = new Date(currentDate)
        nextDate.setDate(currentDate.getDate() + 1)
        const nextDateString = nextDate.toISOString().split('T')[0]

        taskToMove.date = nextDateString
        const nextDateTasks = newTasks[nextDateString] || []
        newTasks[nextDateString] = [...nextDateTasks, taskToMove]
        success = true
      }

      return success ? newTasks : prevTasks
    })

    return Promise.resolve(!isCompleted && success)
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    getTasksForDate,
    moveTaskToNextDay
  }), [tasks, addTask, toggleTask, deleteTask, getTasksForDate, moveTaskToNextDay])

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
