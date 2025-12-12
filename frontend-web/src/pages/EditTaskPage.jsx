import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, ListTodo } from "lucide-react"
import { toast } from "sonner"
import { taskService } from "@/services/task"

export const EditTaskPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingTask, setLoadingTask] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    difficulty: 'MEDIUM',
    recurrenceRule: 'NONE',
    estimatedTime: ''
  })

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoadingTask(true)
      const response = await taskService.getAllTasks()
      if (response.success && response.data) {
        const task = response.data.find(t => t.id === Number(id))
        if (task) {
          let formattedDueDate = ''
          if (task.dueDate) {
            const date = new Date(task.dueDate)
            formattedDueDate = date.toISOString().slice(0, 16)
          }

          setFormData({
            title: task.title || '',
            description: task.description || '',
            dueDate: formattedDueDate,
            difficulty: task.difficulty || 'MEDIUM',
            recurrenceRule: task.recurrenceRule || 'NONE',
            estimatedTime: task.estimatedTime || ''
          })
        } else {
          toast.error('Task not found')
          navigate('/tasks')
        }
      }
    } catch (error) {
      toast.error('Failed to load task')
      navigate('/tasks')
    } finally {
      setLoadingTask(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setLoading(true)
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        difficulty: formData.difficulty,
        recurrenceRule: formData.recurrenceRule,
        estimatedTime: formData.estimatedTime.trim() || null
      }

      const response = await taskService.updateTask(id, taskData)

      if (response.success) {
        toast.success('Task updated successfully!')
        navigate('/tasks')
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loadingTask) {
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
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tasks')}
            className="text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-mint">Edit Task</h1>
        </div>

        <Card className="p-6 bg-background-secondary border-border-muted">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-mint/10">
                <ListTodo className="h-10 w-10 text-mint" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Task Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Wash the dishes"
                className="bg-background border-border-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-foreground-muted text-xs">(optional)</span>
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details about this task..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-background border border-border-muted text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-mint/50 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-foreground-muted text-xs">(affects XP reward)</span>
              </Label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg border-2 border-mint bg-background-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-mint"
              >
                <option value="EASY">Easy (10 XP)</option>
                <option value="MEDIUM">Medium (20 XP)</option>
                <option value="HARD">Hard (30 XP)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-foreground-muted text-xs">(optional)</span>
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-background border-border-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrenceRule">
                Recurrence <span className="text-foreground-muted text-xs">(optional)</span>
              </Label>
              <select
                id="recurrenceRule"
                name="recurrenceRule"
                value={formData.recurrenceRule}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg border-2 border-mint bg-background-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-mint"
              >
                <option value="NONE">None</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">
                Estimated Time <span className="text-foreground-muted text-xs">(optional)</span>
              </Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={formData.estimatedTime}
                onChange={handleChange}
                placeholder="e.g., 30 minutes"
                className="bg-background border-border-muted"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <Spinner size="sm" className="text-background" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  )
}

