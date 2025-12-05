import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  Plus, 
  Users, 
  Crown, 
  User, 
  LogOut, 
  Home,
  Search,
  Check,
  X,
  Copy,
  MapPin,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { householdService } from "@/services/household"
import { Link } from "react-router-dom"

export const HouseholdPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [household, setHousehold] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    fetchHouseholdData()
  }, [])

  const fetchHouseholdData = async () => {
    try {
      setLoading(true)
      const response = await householdService.getCurrentHousehold()
      if (response.success && response.data) {
        setHousehold(response.data)
        setIsHost(response.data.currentUserRole === 'HOST' || response.data.currentUserRole === 'OWNER' || response.data.host === true)
        setPendingRequests(response.data.pendingRequests || [])
      } else {
        setHousehold(null)
      }
    } catch (error) {
      // User not in a household
      setHousehold(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveHousehold = async () => {
    if (!confirm('Are you sure you want to leave this household?')) return
    
    try {
      await householdService.leaveHousehold()
      toast.success('You have left the household')
      setHousehold(null)
    } catch (error) {
      toast.error('Failed to leave household')
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await householdService.handleJoinRequest(requestId, true)
      toast.success('Request accepted!')
      fetchHouseholdData()
    } catch (error) {
      toast.error('Failed to accept request')
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await householdService.handleJoinRequest(requestId, false)
      toast.success('Request rejected')
      fetchHouseholdData()
    } catch (error) {
      toast.error('Failed to reject request')
    }
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(household.inviteCode)
    toast.success('Invite code copied!')
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Container>
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
        <h1 className="text-3xl font-bold text-mint">Household</h1>

        {/* Current Household Section */}
        {household ? (
          <div className="space-y-4">
            {/* Household Info Card */}
            <Card className="p-5 bg-background-secondary border-mint/30">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-mint/10">
                      <Home className="h-6 w-6 text-mint" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{household.name}</h2>
                      <p className="text-sm text-foreground-muted flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {household.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-mint/20 text-mint border-0">
                    {isHost ? 'Host' : 'Member'}
                  </Badge>
                </div>

                {household.address && (
                  <div className="flex items-center gap-2 text-foreground-muted">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{household.address}</span>
                  </div>
                )}

                {household.description && (
                  <div className="flex items-start gap-2 text-foreground-muted">
                    <FileText className="h-4 w-4 mt-0.5" />
                    <span className="text-sm">{household.description}</span>
                  </div>
                )}

                {/* Invite Code */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border-muted">
                  <div>
                    <p className="text-xs text-foreground-muted">Invite Code</p>
                    <p className="text-lg font-mono font-bold text-mint tracking-wider">
                      {household.inviteCode}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={copyInviteCode}
                    className="text-mint hover:bg-mint/10"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={handleLeaveHousehold}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Household
                </Button>
              </div>
            </Card>

            {/* Members List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Members</h3>
              {household.members?.map((member) => (
                <Card key={member.userId} className="p-4 bg-background-secondary border-border-muted">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {member.role === "HOST" ? (
                        <Crown className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <User className="h-6 w-6 text-mint" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {member.displayName || member.username}
                      </h4>
                      <p className="text-sm text-foreground-muted">@{member.username}</p>
                    </div>
                    <Badge variant={member.role === "HOST" ? "warning" : "default"}>
                      {member.role}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pending Requests (Host Only) */}
            {isHost && pendingRequests.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Pending Requests
                  <Badge variant="destructive" className="ml-2">
                    {pendingRequests.length}
                  </Badge>
                </h3>
                {pendingRequests.map((request) => (
                  <Card key={request.requestId} className="p-4 bg-background-secondary border-yellow-500/30">
                    <div className="flex items-center gap-4">
                      <User className="h-6 w-6 text-yellow-400" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {request.displayName || request.username}
                        </h4>
                        <p className="text-sm text-foreground-muted">@{request.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="h-9 w-9 bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptRequest(request.requestId)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-9 w-9"
                          onClick={() => handleRejectRequest(request.requestId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* No Household - Show Join/Create Options */
          <div className="space-y-6">
            <Card className="p-8 bg-background-secondary border-border-muted text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center">
                  <Home className="h-8 w-8 text-mint" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">No Household Yet</h2>
                  <p className="text-foreground-muted mt-1">
                    Currently not in a group! Create or Join a Household
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Cards */}
            <div className="grid gap-4">
              <Card 
                className="p-6 bg-background-secondary border-mint/30 cursor-pointer hover:border-mint transition-colors"
                onClick={() => navigate('/household/create')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-mint/10">
                    <Plus className="h-6 w-6 text-mint" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Create Household</h3>
                    <p className="text-sm text-foreground-muted">
                      Start a new household and invite your roommates
                    </p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 bg-background-secondary border-mint/30 cursor-pointer hover:border-mint transition-colors"
                onClick={() => navigate('/household/join')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-mint/10">
                    <Search className="h-6 w-6 text-mint" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Join Household</h3>
                    <p className="text-sm text-foreground-muted">
                      Enter an invite code to join an existing household
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Container>
    </>
  )
}
