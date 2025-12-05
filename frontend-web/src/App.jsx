import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { Header, BottomNav } from "@/components/layout/Header"
import { HomePage } from "@/pages/HomePage"
import { TasksPage } from "@/pages/TasksPage"
import { HouseholdPage } from "@/pages/HouseholdPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/household" element={<HouseholdPage />} />
          <Route path="/tasks" element={<TasksPage />} />

          {/* Protected routes with layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/household" element={<HouseholdPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </main>
                  <BottomNav />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-center" richColors theme="dark" />
      </div>
    </BrowserRouter>
  )
}

export default App
