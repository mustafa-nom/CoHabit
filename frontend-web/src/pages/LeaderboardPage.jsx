import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

export const LeaderboardPage = () => {
  const leaderboard = [
    { id: 1, name: "John Doe", username: "johndoe123", xp: 2500, level: 15, rank: 1 },
    { id: 2, name: "Jane Smith", username: "janesmith", xp: 2200, level: 13, rank: 2 },
    { id: 3, name: "Bob Wilson", username: "bobwilson", xp: 1800, level: 11, rank: 3 },
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />
      default:
        return <span className="text-lg font-bold text-foreground-muted">#{rank}</span>
    }
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-mint">Leaderboard</h1>

        <div className="space-y-3">
          {leaderboard.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                  <p className="text-sm text-foreground-muted">@{user.username}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="default" className="mb-1">
                    Level {user.level}
                  </Badge>
                  <p className="text-sm font-semibold text-mint">{user.xp} XP</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}
