import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Crown, User } from "lucide-react"
import { Link } from "react-router-dom"

export const HouseholdPage = () => {
  const members = [
    { id: 1, name: "John Doe", username: "johndoe123", role: "OWNER", level: 15 },
    { id: 2, name: "Jane Smith", username: "janesmith", role: "ADMIN", level: 13 },
    { id: 3, name: "Bob Wilson", username: "bobwilson", role: "MEMBER", level: 11 },
  ]

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-mint">Household</h1>
          <Button size="icon" className="rounded-full w-12 h-12">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {member.role === "OWNER" ? (
                    <Crown className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <User className="h-6 w-6 text-mint" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-foreground-muted">@{member.username}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={member.role === "OWNER" ? "warning" : "default"}>
                    {member.role}
                  </Badge>
                  <p className="text-sm text-mint">Level {member.level}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
    </>
  )
}
