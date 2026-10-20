
import { useCallback, useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

const emptyForm = {
  user_id: "",
  type: "Monthly",
  start_date: "",
  end_date: "",
  status: "active",
};

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(" ")
      : "";

    throw new Error(
      validationErrors || data.message || `Request failed (${response.status}).`
    );
  }

  return data;
}

function getRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.memberships)) return data.memberships;
  return [];
}

function formatDate(date) {
  if (!date) return "—";
  return String(date).slice(0, 10);
}

export default function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState(null);

  const loadMemberships = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const query = params.toString();
      const data = await apiRequest(
        `/memberships${query ? `?${query}` : ""}`
      );

      setMemberships(getRows(data));
    } catch (err) {
      setError(err.message || "Unable to load memberships.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const loadMembers = useCallback(async () => {
    try {
      const data = await apiRequest("/members");
      setMembers(getRows(data));
    } catch {
      // The members endpoint may not exist in every backend setup.
      // Existing membership records can still be displayed.
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    loadMemberships();
    loadMembers();
  }, [loadMemberships, loadMembers]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(membership) {
    setEditingId(membership.id);
    setForm({
      user_id: String(membership.user_id ?? membership.user?.id ?? ""),
      type: membership.type ?? "Monthly",
      start_date: formatDate(membership.start_date) === "—"
        ? ""
        : formatDate(membership.start_date),
      end_date: formatDate(membership.end_date) === "—"
        ? ""
        : formatDate(membership.end_date),
      status: membership.status ?? "active",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      user_id: Number(form.user_id),
    };

    try {
      if (!payload.user_id) {
        throw new Error("Please select a member.");
      }

      if (!payload.start_date || !payload.end_date) {
        throw new Error("Please enter both membership dates.");
      }

      if (payload.end_date < payload.start_date) {
        throw new Error("The end date must be on or after the start date.");
      }

      const url = editingId
        ? `/memberships/${editingId}`
        : "/memberships";

      await apiRequest(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setSuccess(
        editingId
          ? "Membership updated successfully."
          : "Membership created successfully."
      );

      await loadMemberships();
    } catch (err) {
      setError(err.message || "Unable to save membership.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this membership?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/memberships/${id}`, { method: "DELETE" });
      setSuccess("Membership deleted successfully.");
      await loadMemberships();
    } catch (err) {
      setError(err.message || "Unable to delete membership.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(membership, status) {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/memberships/${membership.id}`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: membership.user_id ?? membership.user?.id,
          type: membership.type,
          start_date: formatDate(membership.start_date),
          end_date: formatDate(membership.end_date),
          status,
        }),
      });

      setSuccess("Membership status updated.");
      await loadMemberships();
    } catch (err) {
      setError(err.message || "Unable to update membership status.");
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">PRIME FITNESS</p>
          <h1>Membership Management</h1>
          <p className="page-subtitle">
            Create, search, update, and manage member subscriptions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateForm}>
          + Add Membership
        </button>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button
            className="alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
          <button
            className="alert-close"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="membership-toolbar">
        <input
          className="form-control search-input"
          type="search"
          placeholder="Search member or membership..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search memberships"
        />

        <select
          className="form-control status-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by membership status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
        >
          Reset
        </button>
      </div>

      <div className="membership-summary">
        <div className="summary-card">
          <span>Total shown</span>
          <strong>{memberships.length}</strong>
        </div>
        <div className="summary-card">
          <span>Active</span>
          <strong>
            {memberships.filter((item) => item.status === "active").length}
          </strong>
        </div>
        <div className="summary-card">
          <span>Expired</span>
          <strong>
            {memberships.filter((item) => item.status === "expired").length}
          </strong>
        </div>
      </div>

      {showForm && (
        <section className="membership-form-card">
          <div className="section-heading">
            <div>
              <h2>{editingId ? "Edit Membership" : "Add Membership"}</h2>
              <p>Enter the membership details below.</p>
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-group">
                <span>Member</span>
                <select
                  className="form-control"
                  name="user_id"
                  value={form.user_id}
                  onChange={updateField}
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.email || `Member #${member.id}`}
                    </option>
                  ))}
                  {form.user_id &&
                    !members.some(
                      (member) => String(member.id) === form.user_id
                    ) && (
                      <option value={form.user_id}>
                        Member #{form.user_id}
                      </option>
                    )}
                </select>
                {members.length === 0 && (
                  <small>
                    The member list could not be loaded. Check that your
                    backend provides a members endpoint.
                  </small>
                )}
              </label>

              <label className="form-group">
                <span>Membership type</span>
                <select
                  className="form-control"
                  name="type"
                  value={form.type}
                  onChange={updateField}
                  required
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </label>

              <label className="form-group">
                <span>Start date</span>
                <input
                  className="form-control"
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="form-group">
                <span>End date</span>
                <input
                  className="form-control"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={updateField}
                  min={form.start_date || undefined}
                  required
                />
              </label>

              <label className="form-group">
                <span>Status</span>
                <select
                  className="form-control"
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  required
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Membership"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="table-card">
        <div className="section-heading">
          <div>
            <h2>Membership Records</h2>
            <p>Review and manage existing memberships.</p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={loadMemberships}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading memberships...</div>
        ) : memberships.length === 0 ? (
          <div className="empty-state">
            <strong>No memberships found</strong>
            <p>Try changing your search or add a new membership.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Type</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {memberships.map((membership) => (
                  <tr key={membership.id}>
                    <td>#{membership.id}</td>
                    <td>
                      <strong>
                        {membership.user?.name ||
                          membership.member?.name ||
                          membership.user?.email ||
                          `Member #${membership.user_id ?? "—"}`}
                      </strong>
                      {membership.user?.email && (
                        <small className="table-subtext">
                          {membership.user.email}
                        </small>
                      )}
                    </td>
                    <td>{membership.type || "—"}</td>
                    <td>{formatDate(membership.start_date)}</td>
                    <td>{formatDate(membership.end_date)}</td>
                    <td>
                      <select
                        className={`status-badge status-${(
                          membership.status || "pending"
                        ).toLowerCase()}`}
                        value={membership.status || "pending"}
                        onChange={(event) =>
                          handleStatusChange(membership, event.target.value)
                        }
                        aria-label={`Status for membership ${membership.id}`}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-small btn-edit"
                          onClick={() => openEditForm(membership)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-small btn-delete"
                          onClick={() => handleDelete(membership.id)}
                          disabled={deletingId === membership.id}
                        >
                          {deletingId === membership.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
