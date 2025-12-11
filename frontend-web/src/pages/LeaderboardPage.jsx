import { useState, useEffect } from "react"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Trophy, Medal, Award } from "lucide-react"
import api from "@/services/api"
import { toast } from "sonner"

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/leaderboard')
      if (response.data.success) {
        setLeaderboard(response.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-mint">Leaderboard</h1>

        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-foreground-muted">No leaderboard data yet. Complete tasks to earn XP!</p>
            </Card>
          ) : (
            leaderboard.map((user) => (
              <Card key={user.userId} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{user.displayName}</h3>
                    <p className="text-sm text-foreground-muted">@{user.username}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="default" className="mb-1">
                      Level {user.level}
                    </Badge>
                    <p className="text-sm font-semibold text-mint">{user.totalXp} XP</p>
                    <p className="text-xs text-foreground-muted">{user.tasksCompleted} tasks</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Container>
  )
}
