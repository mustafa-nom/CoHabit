import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { authService } from "@/services/auth"
import { useUser } from "@/contexts/UserContext"
import { Menu } from "lucide-react"

export const LoginPage = () => {
  const navigate = useNavigate()
  const { updateUser } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const targetPath = isLogin ? '/' : '/household'
      let response;
      if (isLogin) {
        response = await authService.login(formData.username, formData.password)
        toast.success('Login successful!')
      } else {
        response = await authService.register({
          username: formData.username,
          password: formData.password,
          displayName: formData.displayName,
        })
        toast.success('Account created successfully!')
      }

      // Update user context with response data
      if (response?.data) {
        updateUser({
          id: response.data.userId,
          username: response.data.username,
          displayName: response.data.displayName
        })
      }

      navigate(targetPath)
    } catch (error) {
      toast.error(isLogin ? 'Login failed' : 'Registration failed', {
        description: 'Please check your credentials and try again'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-mint bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <div className="text-2xl font-bold text-mint flex items-center gap-2">
              CoHabit
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-mint mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-foreground-muted">
              {isLogin ? 'Sign in to your account' : 'Join your household today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="John Doe (optional)"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Spinner size="sm" className="text-background" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-mint hover:text-mint-light transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
