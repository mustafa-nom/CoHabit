import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { healthCheck } from "@/services/api"
import { Activity, ArrowRight } from "lucide-react"

export const HomePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)

  const checkApiHealth = async () => {
    setLoading(true)
    try {
      const response = await healthCheck()
      setApiStatus(response.status)
      toast.success(`API Status: ${response.status}`, {
        description: response.message
      })
    } catch (error) {
      setApiStatus('DOWN')
      toast.error('Could not connect to the backend API', {
        description: 'Make sure the backend server is running on port 8080'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-mint">CoHabit</h1>
          <p className="text-xl md:text-2xl text-foreground-muted">
            Household Management Made Simple
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-mint" />
          <span className="text-lg text-foreground">API Status:</span>
          <Badge variant={apiStatus === 'UP' ? 'success' : apiStatus === 'DOWN' ? 'error' : 'default'}>
            {apiStatus || 'Unknown'}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            onClick={checkApiHealth}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Spinner size="sm" className="text-background" />
            ) : (
              'Check API Connection'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="w-full group"
          >
            <span>View Tasks</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Container>
  )
}
