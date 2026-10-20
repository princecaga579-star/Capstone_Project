
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://127.0.0.1:8000/api";

function WorkoutLogs() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await axios.get(`${API_URL}/workout-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setItems(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load workout logs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, [token]);

  const filtered = items.filter((item) => {
    const text = [
      item.user?.name,
      item.exercise?.name,
      item.workout_program?.name,
      item.notes,
      item.date,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">TRAINING HISTORY</p>
          <h1>Workout Logs</h1>
          <p className="muted">Review recorded workout sessions.</p>
        </div>
      </div>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search workout logs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="content-card">
        {loading ? (
          <p className="loading">Loading workout logs...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No workout logs found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Exercise</th>
                  <th>Program</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.user?.name ?? "—"}</td>
                    <td>{item.exercise?.name ?? "—"}</td>
                    <td>{item.workout_program?.name ?? "—"}</td>
                    <td>{item.date ?? item.workout_date ?? "—"}</td>
                    <td>
                      {item.duration != null
                        ? `${item.duration} min`
                        : "—"}
                    </td>
                    <td>{item.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default WorkoutLogs;
