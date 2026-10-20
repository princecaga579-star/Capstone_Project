
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://127.0.0.1:8000/api";

function WorkoutPrograms() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPrograms() {
      try {
        const response = await axios.get(`${API_URL}/workout-programs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setItems(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load workout programs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, [token]);

  const filtered = items.filter((item) =>
    `${item.name ?? ""} ${item.description ?? ""} ${item.level ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">TRAINING PLANS</p>
          <h1>Workout Programs</h1>
          <p className="muted">Explore the available training programs.</p>
        </div>
      </div>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search workout programs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading">Loading programs...</p>
      ) : filtered.length === 0 ? (
        <section className="content-card empty-state">
          No workout programs found.
        </section>
      ) : (
        <section className="resource-grid">
          {filtered.map((item) => (
            <article className="resource-card" key={item.id}>
              <span className="resource-icon">WP</span>
              <p className="eyebrow">WORKOUT PROGRAM</p>
              <h2>{item.name ?? "Untitled Program"}</h2>
              <p className="muted">
                {item.description || "No description provided."}
              </p>
              <div className="resource-meta">
                <span>Level: {item.level ?? "Not specified"}</span>
                <span>Duration: {item.duration ?? "—"}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default WorkoutPrograms;
