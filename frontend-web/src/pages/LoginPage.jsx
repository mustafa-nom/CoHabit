import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { authService } from "@/services/auth"
import { Menu } from "lucide-react"

export const LoginPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    fname: '',
    lname: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password)
        toast.success('Login successful!')
      } else {
        await authService.register({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName || formData.fname,
          fname: formData.fname,
          lname: formData.lname,
        })
        toast.success('Account created successfully!')
      }
      navigate('/')
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
              <Menu className="h-6 w-6" />
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
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input
                    id="fname"
                    name="fname"
                    type="text"
                    required={!isLogin}
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input
                    id="lname"
                    name="lname"
                    type="text"
                    required={!isLogin}
                    value={formData.lname}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="JohnD (optional)"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

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
