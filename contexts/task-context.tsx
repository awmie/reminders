"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Type for task data
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
  deleteTask: (taskId: number) => void
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

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Record<string, Task[]>>(initialTasksData)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("productivityTasks")
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks))
      } catch (error) {
        console.error("Failed to parse stored tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("productivityTasks", JSON.stringify(tasks))
  }, [tasks])

  // Generate a unique ID for new tasks
  const generateId = () => {
    const allTasks = Object.values(tasks).flat()
    return allTasks.length > 0 ? Math.max(...allTasks.map((task) => task.id)) + 1 : 1
  }

  // Add a new task
  const addTask = (date: string, text: string, description?: string) => {
    const newTask: Task = {
      id: generateId(),
      text,
      description,
      completed: false,
      date,
    }

    setTasks((prevTasks) => {
      const dateTasks = prevTasks[date] || []
      return {
        ...prevTasks,
        [date]: [...dateTasks, newTask],
      }
    })
  }

  // Toggle task completion
  const toggleTask = (taskId: number) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks }

      // Find the date that contains this task
      for (const date in newTasks) {
        const taskIndex = newTasks[date].findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          newTasks[date] = newTasks[date].map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          )
          break
        }
      }

      return newTasks
    })
  }

  // Delete a task
  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks }

      // Find the date that contains this task
      for (const date in newTasks) {
        const taskIndex = newTasks[date].findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          newTasks[date] = newTasks[date].filter((task) => task.id !== taskId)
          break
        }
      }

      return newTasks
    })
  }

  return <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
