import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Home, Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { householdService } from "@/services/household"

export const CreateHouseholdPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Household name is required')
      return
    }

    setLoading(true)
    try {
      const response = await householdService.createHousehold({
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        description: formData.description.trim() || null
      })
      
      if (response.success) {
        setInviteCode(response.data.inviteCode)
        setCreated(true)
        toast.success('Household created!')
      }
    } catch (error) {
      toast.error('Failed to create household')
    } finally {
      setLoading(false)
    }
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast.success('Invite code copied to clipboard!')
  }

  // Success Screen
  if (created) {
    return (
      <Container>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <Card className="p-8 bg-background-secondary border-mint/30 text-center max-w-md w-full">
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-mint/20 flex items-center justify-center">
                <Check className="h-10 w-10 text-mint" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-mint">Household Created!</h1>
                <p className="text-foreground-muted mt-2">
                  Share this invite code with your roommates
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background border border-mint/50">
                <p className="text-xs text-foreground-muted mb-2">Invite Code</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-3xl font-mono font-bold text-mint tracking-[0.3em]">
                    {inviteCode}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={copyInviteCode}
                    className="text-mint hover:bg-mint/10"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => navigate('/household')}
              >
                Go to Household
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    )
  }

  // Create Form
  return (
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
          <h1 className="text-2xl font-bold text-mint">Create Household</h1>
        </div>

        {/* Form Card */}
        <Card className="p-6 bg-background-secondary border-border-muted">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-mint/10">
                <Home className="h-10 w-10 text-mint" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Household Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., The Awesome Apartment"
                className="bg-background border-border-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-foreground-muted text-xs">(optional)</span>
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, Apt 4B"
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
                placeholder="Tell us about your household..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-background border border-border-muted text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-mint/50 resize-none"
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
                'Create Household'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  )
}
