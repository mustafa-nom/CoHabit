import { useState } from "react"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, RotateCcw } from "lucide-react"
import { cn } from "@/utils/cn"
import { Link } from "react-router-dom"

export const TasksPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "WASH THE DISHES", points: 30, category: "Today", completed: false },
    { id: 2, title: "MOP THE BATHROOM", points: 50, category: "Today", completed: false },
    { id: 3, title: "FOLD THE LAUNDRY", points: null, category: "Tomorrow", type: "PERSONAL", completed: false },
    { id: 4, title: "CLEAN COUNTER", points: 20, category: "Tomorrow", completed: false },
  ])

  const [weekInfo, setWeekInfo] = useState({
    start: "Oct 27",
    end: "Nov 2",
    resetTime: "0d 3h"
  })

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const todayTasks = tasks.filter(t => t.category === "Today")
  const tomorrowTasks = tasks.filter(t => t.category === "Tomorrow")

  return (
    <>
    <header className="border-b border-mint bg-background-secondary">
          <div className="flex container mx-auto px-4">
              <div className="w-1/18 flex h-16 items-center justify-center-safe">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> CoHabit </div>
              </div>
              <div className="w-17/20 flex h-16 items-center justify-around">
                  <Link to="/household">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Households </div>
                  </Link>
                  <Link to="/tasks">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-mint">Your Tasks</h1>
          <Button size="icon" className="rounded-full w-14 h-14">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Week Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-mint">
            <Calendar className="h-4 w-4" />
            <span>Week of {weekInfo.start} - {weekInfo.end}</span>
          </div>
          <div className="text-foreground-muted">
            Resets in {weekInfo.resetTime}
          </div>
        </div>

        {/* Today Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-mint" />
            Today
          </h2>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:border-mint-light",
                  task.completed && "opacity-60"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {task.title}
                    </h3>
                    {task.points && (
                      <p className="text-mint font-semibold">
                        {task.points} POINTS
                      </p>
                    )}
                    {task.type && (
                      <Badge variant="default" className="mt-2">
                        {task.type}
                      </Badge>
                    )}
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                    task.completed
                      ? "bg-mint border-mint"
                      : "border-mint"
                  )}>
                    {task.completed && (
                      <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tomorrow Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Tomorrow</h2>
          <div className="space-y-3">
            {tomorrowTasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:border-mint-light",
                  task.completed && "opacity-60"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {task.title}
                    </h3>
                    {task.points && (
                      <p className="text-mint font-semibold">
                        {task.points} POINTS
                      </p>
                    )}
                    {task.type && (
                      <Badge variant="default" className="mt-2">
                        {task.type}
                      </Badge>
                    )}
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                    task.completed
                      ? "bg-mint border-mint"
                      : "border-mint"
                  )}>
                    {task.completed && (
                      <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
    </>
  )
}
