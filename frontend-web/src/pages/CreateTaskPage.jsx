import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, ListTodo, Check } from "lucide-react"
import { toast } from "sonner"
import { taskService } from "@/services/task"
import { householdService } from "@/services/household"

export const CreateTaskPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [householdMembers, setHouseholdMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    difficulty: 'MEDIUM',
    recurrenceRule: 'NONE',
    assigneeUserIds: [],
    rotateAssignments: false,
    estimatedTime: ''
  })

  useEffect(() => {
    fetchHouseholdMembers()
  }, [])

  const fetchHouseholdMembers = async () => {
    try {
      setLoadingMembers(true)
      const response = await householdService.getCurrentHousehold()
      if (response.success && response.data) {
        setHouseholdMembers(response.data.members || [])
      }
    } catch (error) {
      toast.error('Failed to load household members')
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAssigneeToggle = (userId) => {
    setFormData(prev => {
      const currentAssignees = prev.assigneeUserIds || []
      const isSelected = currentAssignees.includes(userId)

      return {
        ...prev,
        assigneeUserIds: isSelected
          ? currentAssignees.filter(id => id !== userId)
          : [...currentAssignees, userId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    // Validate rotate assignments
    if (formData.rotateAssignments) {
      if (formData.recurrenceRule === 'NONE') {
        toast.error('Rotate assignments requires a recurrence schedule')
        return
      }
      if (!formData.assigneeUserIds || formData.assigneeUserIds.length < 2) {
        toast.error('Rotate assignments requires at least 2 assignees')
        return
      }
    }

    setLoading(true)
    try {
      // Prepare the data for submission
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        difficulty: formData.difficulty,
        recurrenceRule: formData.recurrenceRule,
        assigneeUserIds: formData.assigneeUserIds.length > 0 ? formData.assigneeUserIds : null,
        rotateAssignments: formData.rotateAssignments,
        estimatedTime: formData.estimatedTime.trim() || null
      }

      const response = await taskService.createTask(taskData)

      if (response.success) {
        toast.success('Task created successfully!')
        navigate('/tasks')
      }
    } catch (error) {
      // Error already handled by api interceptor
      console.error('Failed to create task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tasks')}
            className="text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-mint">Create Task</h1>
        </div>

        {/* Form Card */}
        <Card className="p-6 bg-background-secondary border-border-muted">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-mint/10">
                <ListTodo className="h-10 w-10 text-mint" />
              </div>
            </div>

            {/* Task Title */}
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

            {/* Description */}
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

            {/* Difficulty */}
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

            {/* Due Date */}
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

            {/* Recurrence */}
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

            {/* Estimated Time */}
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

            {/* Assignees */}
            <div className="space-y-2">
              <Label>
                Assign To <span className="text-foreground-muted text-xs">(defaults to you)</span>
              </Label>
              {loadingMembers ? (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="space-y-2">
                  {householdMembers.map((member) => (
                    <div
                      key={member.userId}
                      onClick={() => handleAssigneeToggle(member.userId)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border-muted cursor-pointer hover:border-mint transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        formData.assigneeUserIds.includes(member.userId)
                          ? 'bg-mint border-mint'
                          : 'border-mint'
                      }`}>
                        {formData.assigneeUserIds.includes(member.userId) && (
                          <Check className="h-3 w-3 text-background" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{member.displayName}</p>
                        <p className="text-foreground-muted text-sm">@{member.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rotate Assignments */}
            {formData.recurrenceRule !== 'NONE' && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border-muted">
                <input
                  type="checkbox"
                  id="rotateAssignments"
                  name="rotateAssignments"
                  checked={formData.rotateAssignments}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-mint text-mint focus:ring-mint cursor-pointer"
                />
                <div className="flex-1">
                  <Label htmlFor="rotateAssignments" className="cursor-pointer">
                    Rotate Assignment
                  </Label>
                  <p className="text-foreground-muted text-xs mt-1">
                    Automatically rotate assignees on each recurrence (requires 2+ assignees)
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <Spinner size="sm" className="text-background" />
              ) : (
                'Create Task'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  )
}
