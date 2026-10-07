import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Memberships from './pages/Memberships'
import WorkoutPrograms from './pages/WorkoutPrograms'
import Exercises from './pages/Exercises'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Memberships */}
        <Route
          path="/memberships"
          element={
            <ProtectedRoute>
              <Memberships />
            </ProtectedRoute>
          }
        />

        {/* Workout Programs */}
        <Route
          path="/workout-programs"
          element={
            <ProtectedRoute>
              <WorkoutPrograms />
            </ProtectedRoute>
          }
        />

        {/* Exercises */}
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          }
        />

        {/* Admin Workout Programs */}
        <Route
          path="/admin/workout-programs"
          element={
            <AdminRoute>
              <WorkoutPrograms />
            </AdminRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App