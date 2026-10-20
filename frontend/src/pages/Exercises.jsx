
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://127.0.0.1:8000/api";

function Exercises() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await axios.get(`${API_URL}/exercises`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setItems(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load exercises."
        );
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, [token]);

  const filtered = items.filter((item) =>
    `${item.name ?? ""} ${item.description ?? ""} ${item.muscle_group ?? ""} ${item.category ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">EXERCISE LIBRARY</p>
          <h1>Exercises</h1>
          <p className="muted">Browse exercises and target muscle groups.</p>
        </div>
      </div>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search exercises..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading">Loading exercises...</p>
      ) : filtered.length === 0 ? (
        <section className="content-card empty-state">
          No exercises found.
        </section>
      ) : (
        <section className="resource-grid">
          {filtered.map((item) => (
            <article className="resource-card" key={item.id}>
              <span className="resource-icon">EX</span>
              <p className="eyebrow">
                {item.muscle_group ?? item.category ?? "EXERCISE"}
              </p>
              <h2>{item.name ?? "Untitled Exercise"}</h2>
              <p className="muted">
                {item.description || "No description provided."}
              </p>
              <div className="resource-meta">
                <span>Sets: {item.sets ?? "—"}</span>
                <span>Reps: {item.reps ?? "—"}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Exercises;
