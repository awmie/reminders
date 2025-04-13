import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { DailySummary } from "@/components/daily-summary"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus } from "lucide-react"

export default function DayPage({ params }: { params: { date: string } }) {
  // Format the date from URL parameter (e.g., "2023-04-15" to "April 15, 2023")
  const formattedDate = new Date(params.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2 rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">{formattedDate}</h1>
          <div className="ml-auto">
            <Link href={`/${params.date}/new-task`}>
              <Button size="sm" className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <TaskList date={params.date} />
          <DailySummary date={params.date} />
        </div>
      </main>
    </div>
  )
}
