import { useEffect, useState } from "react";

export default function ManagementPage({
  title,
  description,
  storageKey,
  fields,
}) {
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, storageKey]);

  function resetForm() {
    setForm({});
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingId ? { ...record, ...form } : record
        )
      );
    } else {
      setRecords((previous) => [
        ...previous,
        {
          ...form,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        },
      ]);
    }

    resetForm();
  }

  function handleEdit(record) {
    setEditingId(record.id);

    const values = {};
    fields.forEach((field) => {
      values[field.name] = record[field.name] ?? "";
    });

    setForm(values);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords((previous) =>
        previous.filter((record) => record.id !== id)
      );

      if (editingId === id) resetForm();
    }
  }

  const filteredRecords = records.filter((record) =>
    fields.some((field) =>
      String(record[field.name] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <section className="management-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PRIME FITNESS / MANAGEMENT</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <span className="record-count">
          {records.length} {records.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      <div className="panel form-panel">
        <div className="panel-heading">
          <div>
            <h2>{editingId !== null ? "Edit Record" : "Add New Record"}</h2>
            <p>Enter the details below.</p>
          </div>
        </div>

        <form className="record-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={`${storageKey}-${field.name}`}>
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  id={`${storageKey}-${field.name}`}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [field.name]: event.target.value,
                    })
                  }
                  required={field.required !== false}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${storageKey}-${field.name}`}
                  type={field.type || "text"}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [field.name]: event.target.value,
                    })
                  }
                  min={field.min}
                  step={field.step}
                  required={field.required !== false}
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId !== null ? "Save Changes" : "+ Add Record"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>{title} List</h2>
            <p>View and manage your records.</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {fields.map((field) => (
                    <td key={field.name}>
                      {record[field.name] || "—"}
                    </td>
                  ))}

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="empty-state"
                  >
                    <span>📋</span>
                    <strong>No records found</strong>
                    <p>Add a record or try a different search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}