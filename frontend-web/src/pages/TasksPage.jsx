import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Plus, Calendar, Users, RotateCcw, Clock, ChevronDown, Pencil, Trash } from "lucide-react"
import { cn } from "@/utils/cn"
import { taskService } from "@/services/task"
import { toast } from "sonner"

export const TasksPage = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0) // 0 = current week, 1 = next week, etc.
  const [weekInfo, setWeekInfo] = useState({ start: '', end: '', resetTime: '', startDate: null, endDate: null })

  useEffect(() => {
    fetchTasks()
    calculateWeekInfo(selectedWeekOffset)

    // Update reset time every minute (only for current week)
    const interval = setInterval(() => {
      if (selectedWeekOffset === 0) {
        calculateWeekInfo(0)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [selectedWeekOffset])

  const calculateWeekInfo = (weekOffset = 0) => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate the target week's Sunday
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayOfWeek + (weekOffset * 7))
    weekStart.setHours(0, 0, 0, 0)

    // Calculate the target week's Saturday
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Calculate time until current week reset (only for current week)
    let resetTime = ''
    if (weekOffset === 0) {
      const nextReset = new Date(weekStart)
      nextReset.setDate(weekStart.getDate() + 7)
      nextReset.setHours(0, 0, 0, 0)

      const timeDiff = nextReset - now
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      resetTime = `${days}d ${hours}h`
    }

    setWeekInfo({
      start: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      resetTime,
      startDate: weekStart,
      endDate: weekEnd
    })
  }

  const handleWeekChange = (offset) => {
    setSelectedWeekOffset(offset)
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
      const task = tasks.find(t => t.id === id)
      const wasCompleted = task.status === 'COMPLETED'
      
      const response = await taskService.toggleTaskCompletion(id)
      
      // Update tasks list
      if (response.success && response.data) {
        setTasks(tasks.map(t =>
          t.id === id ? response.data : t
        ))
        
        // Show XP message
        if (!wasCompleted) {
          const xp = response.data.xpPoints || task.xpPoints || 20
          toast.success(`Task completed! +${xp} XP earned 🎉`)
        } else {
          toast.success('Task reopened')
        }
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Task deleted')
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getTaskCategory = (task) => {
    if (!task.dueDate) {
      // Anytime tasks show in all weeks
      return 'Anytime'
    }

    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    // Check if task is within selected week range
    let taskInSelectedWeek = dueDate >= weekInfo.startDate && dueDate <= weekInfo.endDate

    // Handle recurring tasks - they should appear in future weeks too
    if (!taskInSelectedWeek && task.recurrenceRule && task.recurrenceRule !== 'NONE') {
      const isRecurring = shouldShowRecurringTask(task, weekInfo.startDate, weekInfo.endDate)
      if (!isRecurring) {
        return null // Don't show if not in range for this recurrence
      }
      taskInSelectedWeek = true
    }

    if (!taskInSelectedWeek) {
      return null // Don't show tasks outside selected week
    }

    // For current week (offset 0), use Today/Tomorrow/This Week categories
    if (selectedWeekOffset === 0) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      today.setHours(0, 0, 0, 0)
      tomorrow.setHours(0, 0, 0, 0)

      // For recurring tasks in current week, check if there's an occurrence today/tomorrow
      if (task.recurrenceRule && task.recurrenceRule !== 'NONE') {
        const occurrenceToday = getRecurringOccurrence(task, today)
        const occurrenceTomorrow = getRecurringOccurrence(task, tomorrow)

        if (occurrenceToday) return 'Today'
        if (occurrenceTomorrow) return 'Tomorrow'
        return 'This Week'
      }

      if (dueDate.getTime() === today.getTime()) return 'Today'
      if (dueDate.getTime() === tomorrow.getTime()) return 'Tomorrow'
      return 'This Week'
    }

    // For future weeks, just show "This Week"
    return 'This Week'
  }

  const shouldShowRecurringTask = (task, weekStart, weekEnd) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    // Don't show recurring tasks in weeks before their first occurrence
    if (weekEnd < dueDate) {
      return false
    }

    const recurrence = task.recurrenceRule

    if (recurrence === 'DAILY') {
      // Daily tasks show in all future weeks
      return true
    } else if (recurrence === 'WEEKLY') {
      // Weekly tasks show in all future weeks
      return true
    } else if (recurrence === 'MONTHLY') {
      // Monthly tasks show in weeks that contain the same day of month
      const dueDateDay = dueDate.getDate()
      const weekStartDay = weekStart.getDate()
      const weekEndDay = weekEnd.getDate()

      // Check if the due date day falls within this week's date range
      // Handle month boundaries
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return dueDateDay >= weekStartDay && dueDateDay <= weekEndDay
      } else {
        // Week spans two months
        return (dueDateDay >= weekStartDay) || (dueDateDay <= weekEndDay)
      }
    }

    return false
  }

  const getRecurringOccurrence = (task, targetDate) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const target = new Date(targetDate)
    target.setHours(0, 0, 0, 0)

    // Don't show occurrences before the original due date
    if (target < dueDate) {
      return false
    }

    const recurrence = task.recurrenceRule

    if (recurrence === 'DAILY') {
      // Daily task occurs every day after due date
      return true
    } else if (recurrence === 'WEEKLY') {
      // Weekly task occurs on the same day of week
      const dueDateDay = dueDate.getDay()
      const targetDay = target.getDay()
      return dueDateDay === targetDay
    } else if (recurrence === 'MONTHLY') {
      // Monthly task occurs on the same date of month
      return dueDate.getDate() === target.getDate()
    }

    return false
  }

  const filteredTasks = tasks.filter(t => {
    const category = getTaskCategory(t)
    return category !== null // Only include tasks with a valid category
  })

  const todayTasks = filteredTasks.filter(t => getTaskCategory(t) === 'Today')
  const tomorrowTasks = filteredTasks.filter(t => getTaskCategory(t) === 'Tomorrow')
  const thisWeekTasks = filteredTasks.filter(t => getTaskCategory(t) === 'This Week')
  const anytimeTasks = filteredTasks.filter(t => getTaskCategory(t) === 'Anytime')

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  const weekOptions = [
    { value: 0, label: 'This Week', sublabel: weekInfo.start && weekInfo.end ? `${weekInfo.start} - ${weekInfo.end}` : '' },
    { value: 1, label: 'Next Week', sublabel: '' },
    { value: 2, label: 'In 2 Weeks', sublabel: '' },
    { value: 3, label: 'In 3 Weeks', sublabel: '' },
    { value: 4, label: 'In 4 Weeks', sublabel: '' },
  ]

  // Calculate sublabels for future weeks
  weekOptions.forEach((option, index) => {
    if (index > 0) {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - dayOfWeek + (option.value * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      option.sublabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
  })

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

        {/* Week Selector */}
        <div className="space-y-2">
          <div className="relative inline-flex items-center">
            <select
              value={selectedWeekOffset}
              onChange={(e) => handleWeekChange(Number(e.target.value))}
              className="pr-5 py-1 bg-transparent text-foreground-muted text-sm appearance-none cursor-pointer focus:outline-none focus:text-foreground"
            >
              {weekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.sublabel})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" />
          </div>
          {selectedWeekOffset === 0 && weekInfo.resetTime && (
            <div className="text-sm text-foreground-muted text-right">
              Resets in {weekInfo.resetTime}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
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
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(id) => navigate(`/tasks/${id}/edit`)}
                  onDelete={deleteTask}
                  selectedWeekOffset={selectedWeekOffset}
                  weekInfo={weekInfo}
                />
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
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(id) => navigate(`/tasks/${id}/edit`)}
                  onDelete={deleteTask}
                  selectedWeekOffset={selectedWeekOffset}
                  weekInfo={weekInfo}
                />
              ))}
            </div>
          </div>
        )}

        {/* This Week Section */}
        {thisWeekTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mint" />
              This Week
            </h2>
            <div className="space-y-3">
              {thisWeekTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(id) => navigate(`/tasks/${id}/edit`)}
                  onDelete={deleteTask}
                  selectedWeekOffset={selectedWeekOffset}
                  weekInfo={weekInfo}
                />
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
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(id) => navigate(`/tasks/${id}/edit`)}
                  onDelete={deleteTask}
                  selectedWeekOffset={selectedWeekOffset}
                  weekInfo={weekInfo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

// Task Card Component
const TaskCard = ({ task, onToggle, onEdit, onDelete, selectedWeekOffset, weekInfo }) => {
  const isCompleted = task.status === 'COMPLETED' || task.status === 'VERIFIED'

  const getDisplayDueDate = (task) => {
    if (!task.dueDate) return null

    // Parse the ISO date string (backend sends in ISO format)
    const originalDueDate = new Date(task.dueDate)

    // If not recurring or in the original week, show original date
    if (!task.recurrenceRule || task.recurrenceRule === 'NONE') {
      return originalDueDate
    }

    // For recurring tasks, calculate the next occurrence in the selected week
    const recurrence = task.recurrenceRule

    if (recurrence === 'DAILY') {
      // For daily tasks, calculate today's occurrence maintaining original time
      const today = new Date()
      today.setHours(originalDueDate.getHours())
      today.setMinutes(originalDueDate.getMinutes())
      today.setSeconds(0)
      today.setMilliseconds(0)

      if (selectedWeekOffset === 0) {
        return today
      }

      // For future weeks, show first day of that week
      const weekStartOccurrence = new Date(weekInfo.startDate)
      weekStartOccurrence.setHours(originalDueDate.getHours())
      weekStartOccurrence.setMinutes(originalDueDate.getMinutes())
      return weekStartOccurrence
    } else if (recurrence === 'WEEKLY') {
      // For weekly tasks, find the same day of week in the selected week
      const originalDay = originalDueDate.getDay() // 0 = Sunday, 6 = Saturday
      const weekStart = new Date(weekInfo.startDate)

      // Calculate the date for that day of week in the selected week
      const nextOccurrence = new Date(weekStart)
      nextOccurrence.setDate(weekStart.getDate() + originalDay)

      // Preserve the original time
      nextOccurrence.setHours(originalDueDate.getHours())
      nextOccurrence.setMinutes(originalDueDate.getMinutes())

      return nextOccurrence
    } else if (recurrence === 'MONTHLY') {
      // For monthly tasks, find the same date of month in the selected week's month
      const targetMonth = weekInfo.startDate.getMonth()
      const targetYear = weekInfo.startDate.getFullYear()
      const originalDate = originalDueDate.getDate()

      const nextOccurrence = new Date(targetYear, targetMonth, originalDate)
      nextOccurrence.setHours(originalDueDate.getHours())
      nextOccurrence.setMinutes(originalDueDate.getMinutes())

      return nextOccurrence
    }

    return originalDueDate
  }

  const formatDueDate = (task) => {
    const date = getDisplayDueDate(task)
    if (!date) return null

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <Card
      className={cn(
        "relative p-4 cursor-pointer transition-all hover:border-mint-light",
        isCompleted && "bg-background-secondary/50"
      )}
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <h3 className={cn(
            "text-lg font-bold",
            isCompleted ? "line-through text-foreground-muted" : "text-foreground"
          )}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className={cn(
              "text-sm",
              isCompleted ? "text-foreground-muted/70" : "text-foreground-muted"
            )}>
              {task.description}
            </p>
          )}

          {/* Task Meta Info */}
          <div className={cn(
            "flex flex-wrap items-center gap-3 text-sm",
            isCompleted && "opacity-70"
          )}>
            {/* XP Points */}
            {task.xpPoints && (
              <div className="flex items-center gap-1 text-mint font-semibold">
                <span>⭐ {task.xpPoints} XP</span>
              </div>
            )}

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
                <span>{formatDueDate(task)}</span>
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
          <div className={cn(
            "flex flex-wrap gap-2",
            isCompleted && "opacity-60"
          )}>
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
              <Badge variant="default" className={cn(
                isCompleted && "bg-mint/10 text-mint/80 border-mint/20"
              )}>
                {task.status}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0 mt-1 h-full">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task.id)
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-mint hover:bg-mint/10 transition-colors"
              title="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <div className={cn(
              "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
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
        </div>

        {/* Delete button bottom-right */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-mint hover:bg-mint/10 transition-colors"
          title="Delete task"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
