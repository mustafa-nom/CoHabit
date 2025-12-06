import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Plus, Calendar, Users, RotateCcw, Clock } from "lucide-react"
import { cn } from "@/utils/cn"
import { taskService } from "@/services/task"
import { toast } from "sonner"

export const TasksPage = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekInfo, setWeekInfo] = useState({ start: '', end: '', resetTime: '' })

  useEffect(() => {
    fetchTasks()
    calculateWeekInfo()

    // Update reset time every minute
    const interval = setInterval(() => {
      calculateWeekInfo()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const calculateWeekInfo = () => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate the most recent Sunday
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayOfWeek)
    weekStart.setHours(0, 0, 0, 0)

    // Calculate next Saturday
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Calculate next Sunday (reset time)
    const nextReset = new Date(weekStart)
    nextReset.setDate(weekStart.getDate() + 7)
    nextReset.setHours(0, 0, 0, 0)

    // Calculate time until reset
    const timeDiff = nextReset - now
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    setWeekInfo({
      start: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      resetTime: `${days}d ${hours}h`
    })
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getAllTasks()
      if (response.success) {
        setTasks(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      // Error toast already shown by interceptor
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (id) => {
    try {
      await taskService.toggleTaskCompletion(id)
      // Optimistically update UI
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: task.status === 'COMPLETED' ? 'OPEN' : 'COMPLETED' } : task
      ))
      toast.success('Task updated')
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const getTaskCategory = (task) => {
    if (!task.dueDate) return 'Anytime'

    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0)
    tomorrow.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    if (dueDate <= today) return 'Today'
    if (dueDate <= tomorrow) return 'Tomorrow'
    return 'Upcoming'
  }

  const todayTasks = tasks.filter(t => getTaskCategory(t) === 'Today')
  const tomorrowTasks = tasks.filter(t => getTaskCategory(t) === 'Tomorrow')
  const upcomingTasks = tasks.filter(t => getTaskCategory(t) === 'Upcoming')
  const anytimeTasks = tasks.filter(t => getTaskCategory(t) === 'Anytime')

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-mint">Your Tasks</h1>
          <Button
            size="icon"
            className="rounded-full w-14 h-14"
            onClick={() => navigate('/tasks/create')}
          >
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

        {/* Empty State */}
        {tasks.length === 0 && (
          <Card className="p-8 text-center bg-background-secondary border-border-muted">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center">
                <Plus className="h-8 w-8 text-mint" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
                <p className="text-foreground-muted mt-1">
                  Create your first task to get started!
                </p>
              </div>
              <Button onClick={() => navigate('/tasks/create')}>
                Create Task
              </Button>
            </div>
          </Card>
        )}

        {/* Today Section */}
        {todayTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mint" />
              Today
            </h2>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}

        {/* Tomorrow Section */}
        {tomorrowTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mint" />
              Tomorrow
            </h2>
            <div className="space-y-3">
              {tomorrowTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        {upcomingTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Upcoming</h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}

        {/* Anytime Section */}
        {anytimeTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Anytime</h2>
            <div className="space-y-3">
              {anytimeTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

// Task Card Component
const TaskCard = ({ task, onToggle }) => {
  const isCompleted = task.status === 'COMPLETED' || task.status === 'VERIFIED'

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:border-mint-light",
        isCompleted && "opacity-60"
      )}
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <h3 className={cn(
            "text-lg font-bold text-foreground",
            isCompleted && "line-through"
          )}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-foreground-muted">
              {task.description}
            </p>
          )}

          {/* Task Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-1 text-mint">
                <Users className="h-4 w-4" />
                <span>
                  {task.assignees.map(a => a.displayName).join(', ')}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-foreground-muted">
                <Calendar className="h-4 w-4" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* Estimated Time */}
            {task.estimatedTime && (
              <div className="flex items-center gap-1 text-foreground-muted">
                <Clock className="h-4 w-4" />
                <span>{task.estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {task.recurrenceRule && task.recurrenceRule !== 'NONE' && (
              <Badge variant="default" className="bg-mint/20 text-mint border-mint/30">
                <RotateCcw className="h-3 w-3 mr-1" />
                {task.recurrenceRule}
              </Badge>
            )}
            {task.rotateAssignments && (
              <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Rotating
              </Badge>
            )}
            {task.status && task.status !== 'OPEN' && (
              <Badge variant="default">
                {task.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Checkbox */}
        <div className={cn(
          "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-1",
          isCompleted
            ? "bg-mint border-mint"
            : "border-mint"
        )}>
          {isCompleted && (
            <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </Card>
  )
}
