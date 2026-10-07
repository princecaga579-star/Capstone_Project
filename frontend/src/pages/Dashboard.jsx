import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Dashboard() {
  const { user, logout } = useAuth()

  const [stats, setStats] = useState({
    total_members: 0,
    total_memberships: 0,
    total_workout_programs: 0,
    total_exercises: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/dashboard')

        setStats(response.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Prime Fitness</h1>
          <p>Membership & Workout Management System</p>
        </div>

        <div className="user-section">
          <div>
            <strong>{user?.name}</strong>
            <span>
              {user?.role === 'admin' ? 'Administrator' : 'Member'}
            </span>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <a href="/dashboard">Dashboard</a>
        <a href="/memberships">Memberships</a>
        <a href="/workout-programs">Workout Programs</a>
        <a href="/exercises">Exercises</a>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">

        <div className="welcome-section">
          <h2>Welcome, {user?.name}! 💪</h2>
          <p>
            Here's an overview of your Prime Fitness system.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading dashboard...
          </div>
        ) : (
          <div className="stats-grid">

            {/* Members */}
            <div className="stat-card">
              <div className="stat-icon">👥</div>

              <div>
                <p>Total Members</p>
                <h3>{stats.total_members}</h3>
              </div>
            </div>

            {/* Memberships */}
            <div className="stat-card">
              <div className="stat-icon">💳</div>

              <div>
                <p>Total Memberships</p>
                <h3>{stats.total_memberships}</h3>
              </div>
            </div>

            {/* Workout Programs */}
            <div className="stat-card">
              <div className="stat-icon">🏋️</div>

              <div>
                <p>Workout Programs</p>
                <h3>{stats.total_workout_programs}</h3>
              </div>
            </div>

            {/* Exercises */}
            <div className="stat-card">
              <div className="stat-icon">💪</div>

              <div>
                <p>Total Exercises</p>
                <h3>{stats.total_exercises}</h3>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default Dashboard