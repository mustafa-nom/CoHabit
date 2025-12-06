import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { authService } from "@/services/auth"
import { profileService } from "@/services/api"
import { useUser } from "@/contexts/UserContext"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, loading: userLoading, updateUser, clearUser, fetchUser } = useUser()
  const [view, setView] = useState('main')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    newDisplayName: '',
    verifyDisplayName: '',
    newUsername: '',
    verifyUsername: '',
    currentPassword: '',
    newPassword: '',
    verifyPassword: '',
  })

  useEffect(() => {
    if (!user && !userLoading) {
      fetchUser()
    }
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    clearUser()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({
      newDisplayName: '',
      verifyDisplayName: '',
      newUsername: '',
      verifyUsername: '',
      currentPassword: '',
      newPassword: '',
      verifyPassword: '',
    })
  }

  const handleChangeDisplayName = async () => {
    if (formData.newDisplayName !== formData.verifyDisplayName) {
      toast.error('Display names do not match')
      return
    }

    if (!formData.newDisplayName.trim()) {
      toast.error('Display name cannot be empty')
      return
    }

    setLoading(true)
    try {
      const response = await profileService.updateDisplayName(formData.newDisplayName)

      if (response.success && response.data) {
        updateUser({
          ...user,
          displayName: response.data.displayName
        })
        toast.success('Display name updated successfully!')
        resetForm()
        setView('main')
      }
    } catch (error) {
      toast.error('Failed to update display name')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeUsername = async () => {
    if (formData.newUsername !== formData.verifyUsername) {
      toast.error('Usernames do not match')
      return
    }

    if (formData.newUsername.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    setLoading(true)
    try {
      const response = await profileService.updateUsername(formData.newUsername)

      if (response.success && response.data) {
        updateUser({
          ...user,
          username: response.data.username
        })
        toast.success('Username updated successfully!')
        resetForm()
        setView('main')
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Username already taken')
      } else {
        toast.error('Failed to update username')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.verifyPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!formData.currentPassword) {
      toast.error('Current password is required')
      return
    }

    setLoading(true)
    try {
      await profileService.updatePassword(formData.currentPassword, formData.newPassword)
      toast.success('Password updated successfully!')
      resetForm()
      setView('main')
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Current password is incorrect')
      } else {
        toast.error('Failed to update password')
      }
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-mint">Unable to load profile</h1>
          <Button onClick={() => navigate('/login')}>Return to Login</Button>
        </div>
      </Container>
    )
  }

  if (view === 'changeName') {
    return (
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Change Display Name</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newDisplayName">New Display Name:</Label>
              <Input
                id="newDisplayName"
                name="newDisplayName"
                value={formData.newDisplayName}
                onChange={handleChange}
                placeholder="Enter new display name"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyDisplayName">Verify Display Name:</Label>
              <Input
                id="verifyDisplayName"
                name="verifyDisplayName"
                value={formData.verifyDisplayName}
                onChange={handleChange}
                placeholder="Verify display name"
                disabled={loading}
              />
            </div>

            <Button onClick={handleChangeDisplayName} className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (view === 'changeUsername') {
    return (
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Change Username</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newUsername">New Username:</Label>
              <Input
                id="newUsername"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Enter new username"
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <Button onClick={handleChangeUsername} className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (view === 'changePassword') {
    return (
      <Container>
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-mint flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-mint">Change Password</h1>

          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password:</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password:</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <Button onClick={handleChangePassword} className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-mint">Profile Page</h1>

        <div className="max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{user.displayName || user.username}</h2>
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
  )
}
