import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authService } from "@/services/auth"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export const ProfilePage = () => {
  const navigate = useNavigate()
  const [view, setView] = useState('main') // main, changeName, changeUsername, changePassword
  const [formData, setFormData] = useState({
    newDisplayName: '',
    verifyDisplayName: '',
    newUsername: '',
    verifyUsername: '',
    newPassword: '',
    verifyPassword: '',
  })

  // Mock user data - replace with actual user data
  const user = {
    displayName: "John Doe",
    username: "johndoe123"
  }

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleConfirm = () => {
    // Add validation and API calls here
    toast.success('Changes saved successfully!')
    setView('main')
  }

  if (view === 'changeName') {
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
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Profile Page</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newDisplayName">New Display Name:</Label>
              <Input
                id="newDisplayName"
                name="newDisplayName"
                value={formData.newDisplayName}
                onChange={handleChange}
                placeholder="Enter new display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyDisplayName">Verify Name:</Label>
              <Input
                id="verifyDisplayName"
                name="verifyDisplayName"
                value={formData.verifyDisplayName}
                onChange={handleChange}
                placeholder="Verify display name"
              />
            </div>

            <Button onClick={handleConfirm} className="w-full">
              Confirm
            </Button>
          </div>
        </div>
      </Container>
      </>
    )
  }

  if (view === 'changeUsername') {
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
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Profile Page</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newUsername">New Username:</Label>
              <Input
                id="newUsername"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Enter new username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyUsername">Verify Username:</Label>
              <Input
                id="verifyUsername"
                name="verifyUsername"
                value={formData.verifyUsername}
                onChange={handleChange}
                placeholder="Verify username"
              />
            </div>

            <Button onClick={handleConfirm} className="w-full">
              Confirm
            </Button>
          </div>
        </div>
      </Container>
      </>
    )
  }

  if (view === 'changePassword') {
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
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Profile Page</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password:</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyPassword">Verify Password:</Label>
              <Input
                id="verifyPassword"
                name="verifyPassword"
                type="password"
                value={formData.verifyPassword}
                onChange={handleChange}
                placeholder="Verify password"
              />
            </div>

            <Button onClick={handleConfirm} className="w-full">
              Confirm
            </Button>
          </div>
        </div>
      </Container>
      </>
    )
  }

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
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-mint">Profile Page</h1>

        <div className="max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{user.displayName}</h2>
            <p className="text-foreground-muted">
              <span className="font-medium">Username:</span> {user.username}
            </p>
          </div>

          <Separator className="bg-mint/20" />

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => setView('changeName')}>
              Change Display Name
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setView('changeUsername')}>
              Change Username
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setView('changePassword')}>
              Change Password
            </Button>
          </div>

          <Separator className="bg-mint/20" />

          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </Container>
    </>
  )
}
