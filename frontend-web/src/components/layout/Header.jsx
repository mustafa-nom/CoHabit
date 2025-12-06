import { Link, useLocation } from "react-router-dom"
import { Menu, Home, Users, Trophy, ClipboardList, UserCircle } from "lucide-react"
import { cn } from "@/utils/cn"
import { authService } from "@/services/auth"

export const Header = () => {
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()

  const navItems = [
    { icon: Home, label: "Home", path: "/", key: "home" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard", key: "leaderboard" },
    { icon: ClipboardList, label: "Tasks", path: "/tasks", key: "tasks" },
    { icon: Users, label: "Household", path: "/household", key: "household" },
    { icon: UserCircle, label: "Profile", path: "/profile", key: "profile" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="border-b border-mint bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-mint flex items-center gap-2">
            CoHabit
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-mint",
                    isActive(item.path) ? "text-mint" : "text-foreground-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export const BottomNav = () => {
  const location = useLocation()

  const navItems = [
    { icon: Home, path: "/" },
    { icon: Trophy, path: "/leaderboard" },
    { icon: ClipboardList, path: "/tasks" },
    { icon: Users, path: "/household" },
    { icon: UserCircle, path: "/profile" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-mint z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center justify-center w-full h-full transition-colors",
                isActive(item.path) ? "text-mint" : "text-foreground-muted"
              )}
            >
              <Icon className="h-6 w-6" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
