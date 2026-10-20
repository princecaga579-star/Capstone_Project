
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://127.0.0.1:8000/api";

function Dashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    total_members: 0,
    total_memberships: 0,
    total_workout_programs: 0,
    total_exercises: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats((current) => ({
          ...current,
          ...(response.data.stats ?? response.data),
        }));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load dashboard statistics. Check your API route."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  const cards = [
    {
      label: "Total Members",
      value: stats.total_members,
      icon: "01",
      to: "/memberships",
    },
    {
      label: "Membership Records",
      value: stats.total_memberships,
      icon: "02",
      to: "/memberships",
    },
    {
      label: "Workout Programs",
      value: stats.total_workout_programs,
      icon: "03",
      to: "/workout-programs",
    },
    {
      label: "Exercises",
      value: stats.total_exercises,
      icon: "04",
      to: "/exercises",
    },
  ];

  return (
    <main className="page-container">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">YOUR FITNESS WORKSPACE</p>
          <h1>Welcome{user?.name ? `, ${user.name}` : " to Prime Fitness"}!</h1>
          <p>Built through discipline, forged through hard work.</p>
        </div>
        <span className="hero-mark">PF</span>
      </section>

      {error && <p className="error-message">{error}</p>}

      <div className="section-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h2>Dashboard Statistics</h2>
        </div>
        <span className="muted">
          {loading ? "Loading..." : "Current records"}
        </span>
      </div>

      <section className="stats-grid">
        {cards.map((card) => (
          <Link to={card.to} className="stat-card" key={card.label}>
            <span className="stat-icon">{card.icon}</span>
            <p>{card.label}</p>
            <strong>{loading ? "—" : card.value ?? 0}</strong>
            <span className="stat-link">View records →</span>
          </Link>
        ))}
      </section>

      <section className="quick-links">
        <div>
          <h2>Quick Actions</h2>
          <p className="muted">Go directly to a management section.</p>
        </div>
        <div className="quick-link-list">
          <Link to="/memberships">Manage Memberships</Link>
          <Link to="/workout-programs">View Workout Programs</Link>
          <Link to="/exercises">Browse Exercises</Link>
          <Link to="/workout-logs">View Workout Logs</Link>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
