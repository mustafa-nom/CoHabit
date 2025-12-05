import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Home,
  Check,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { householdService } from "@/services/household"

export const JoinHouseholdPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [foundHousehold, setFoundHousehold] = useState(null)
  const [requestSent, setRequestSent] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setFoundHousehold(null)
    
    const code = inviteCode.trim().toUpperCase()
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-character invite code')
      return
    }

    setLoading(true)
    try {
      const response = await householdService.findByInviteCode(code)
      if (response.success && response.data) {
        setFoundHousehold(response.data)
      } else {
        setError('Invalid Group Code, try again!')
      }
    } catch (error) {
      setError('Invalid Group Code, try again!')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestJoin = async () => {
    setLoading(true)
    try {
      const response = await householdService.requestToJoin(foundHousehold.id)
      if (response.success) {
        setRequestSent(true)
      }
    } catch (error) {
      toast.error('Failed to send join request')
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setFoundHousehold(null)
    setInviteCode('')
    setError('')
  }

  // Request Sent Success Screen
  if (requestSent) {
    return (
      <>
    <header className="border-b border-mint bg-background-secondary">
          <div className="flex container mx-auto px-4">
              <div className="w-1/18 flex h-16 items-center justify-center-safe">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> CoHabit </div>
              </div>
              <div className="w-17/20 flex h-16 items-center justify-around">
                  <Link to="/household">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Households </div>
                  </Link>
                  <Link to="/tasks">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
      <Container>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <Card className="p-8 bg-background-secondary border-mint/30 text-center max-w-md w-full">
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-mint/20 flex items-center justify-center">
                <Check className="h-10 w-10 text-mint" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-mint">Request Sent!</h1>
                <p className="text-foreground-muted mt-2">
                  Your request to join <span className="text-foreground font-semibold">{foundHousehold.name}</span> has been sent.
                </p>
                <p className="text-foreground-muted mt-1 text-sm">
                  The host will review your request shortly.
                </p>
              </div>

              <Button 
                className="w-full"
                onClick={() => navigate('/household')}
              >
                Back to Household
              </Button>
            </div>
          </Card>
        </div>
      </Container>
      </>
    )
  }

  // Found Household Preview Screen
  if (foundHousehold) {
    return (
      <>
    <header className="border-b border-mint bg-background-secondary">
          <div className="flex container mx-auto px-4">
              <div className="w-1/18 flex h-16 items-center justify-center-safe">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> CoHabit </div>
              </div>
              <div className="w-17/20 flex h-16 items-center justify-around">
                  <Link to="/household">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Households </div>
                  </Link>
                  <Link to="/tasks">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
      <Container>
        <div className="space-y-6 pb-24">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetSearch}
              className="text-foreground-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-mint">Household Found</h1>
          </div>

          {/* Household Preview Card */}
          <Card className="p-6 bg-background-secondary border-mint/30">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-mint/10">
                  <Home className="h-12 w-12 text-mint" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {foundHousehold.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-foreground-muted">
                  <Users className="h-5 w-5" />
                  <span>{foundHousehold.memberCount} members</span>
                </div>
              </div>

              {foundHousehold.description && (
                <p className="text-center text-foreground-muted text-sm">
                  {foundHousehold.description}
                </p>
              )}

              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full"
                  onClick={handleRequestJoin}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" className="text-background" />
                  ) : (
                    'Request to Join'
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-border-muted"
                  onClick={resetSearch}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Different Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
      </>
    )
  }

  // Search Form Screen
  return (
    <>
    <header className="border-b border-mint bg-background-secondary">
          <div className="flex container mx-auto px-4">
              <div className="w-1/18 flex h-16 items-center justify-center-safe">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> CoHabit </div>
              </div>
              <div className="w-17/20 flex h-16 items-center justify-around">
                  <Link to="/household">
                    <div className="text-2xl font-bold text-mint flex items-center gap-2"> Households </div>
                  </Link>
                  <Link to="/tasks">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Tasks </div>
                  </Link>
                  <Link to="/profile">
                    <div className="text-2xl font-bold text-white flex items-center gap-2"> Profile </div>
                  </Link>
              </div>
          </div>
      </header>
    <Container>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/household')}
            className="text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-mint">Join Household</h1>
        </div>

        {/* Search Card */}
        <Card className="p-6 bg-background-secondary border-border-muted">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-mint/10">
                <Search className="h-10 w-10 text-mint" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Enter Invite Code</h2>
              <p className="text-sm text-foreground-muted mt-1">
                Ask your roommate for the 6-character code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteCode" className="sr-only">Invite Code</Label>
              <Input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="XXXXXX"
                maxLength={6}
                className="bg-background border-border-muted text-center text-2xl font-mono tracking-[0.5em] uppercase h-14"
              />
              {error && (
                <p className="text-red-400 text-sm text-center mt-2">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading || inviteCode.length !== 6} 
              className="w-full"
            >
              {loading ? (
                <Spinner size="sm" className="text-background" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find Household
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
    </>
  )
}
