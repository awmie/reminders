"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTasks } from "@/contexts/task-context"
import type { Task } from "@/contexts/task-context"

// Memoize the TaskItem component for better performance
const TaskItem = memo(({ task, onToggle, onDelete }: { 
  task: Task, 
  onToggle: (id: number) => void,
  onDelete: (id: number) => void 
}) => {
  return (
    <li className="group">
      <div
        className={cn(
          "flex items-center rounded-xl border p-2 sm:p-3 transition-all",
          task.completed
            ? "border-muted bg-muted/50"
            : "border-border hover:border-primary/30 hover:bg-primary/5",
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-full border p-0 transition-all",
            task.completed ? "border-today bg-today text-today-foreground" : "border-input",
          )}
          onClick={() => onToggle(task.id)}
        >
          <Check className={cn("h-3 w-3 transition-opacity", task.completed ? "opacity-100" : "opacity-0")} />
          <span className="sr-only">Mark as {task.completed ? "incomplete" : "complete"}</span>
        </Button>
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "block truncate transition-all text-sm sm:text-base",
              task.completed ? "text-muted-foreground line-through" : "text-foreground",
            )}
          >
            {task.text}
          </span>
          {task.description && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">{task.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-70 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <span className="sr-only">Delete task</span>
        </Button>
      </div>
    </li>
  );
});

TaskItem.displayName = 'TaskItem';

export function TaskList({ date, showKeyboardShortcut = false }: { date: string, showKeyboardShortcut?: boolean }) {
  const { tasks, toggleTask, deleteTask } = useTasks()
  const [isLoading, setIsLoading] = useState(true)
  const [dateTasks, setDateTasks] = useState<Task[]>([])

  // Optimize loading with cleanup function
  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    const loadTasks = () => {
      setIsLoading(true)
      // Use a shorter timeout for better UX
      const timerId = setTimeout(() => {
        if (isMounted) {
          setDateTasks(tasks[date] || [])
          setIsLoading(false)
        }
      }, 150) // Reduced timeout for better responsiveness
      
      return () => clearTimeout(timerId);
    };
    
    const timer = loadTasks();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [date, tasks])
  
  // Memoized handlers to prevent unnecessary re-renders
  const handleToggleTask = useCallback((taskId: number) => {
    toggleTask(taskId)
  }, [toggleTask])
  
  const handleDeleteTask = useCallback((taskId: number) => {
    deleteTask(taskId)
    // Immediately update local state for better UI responsiveness
    setDateTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }, [deleteTask])

  if (isLoading) {
    return (
      <div className="space-y-1">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <ul className="space-y-2">
        {dateTasks.map((task) => (
          <TaskItem 
            key={`task-${task.id}`}
            task={task}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
      {dateTasks.length === 0 && (
        <div className="flex h-20 sm:h-24 items-center justify-center rounded-xl border border-dashed">
          <p className="text-sm text-muted-foreground">No tasks for this day</p>
        </div>
      )}
    </div>
  )
}
