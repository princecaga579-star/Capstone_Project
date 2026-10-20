
import { useState } from "react";

export default function WorkoutProgramForm({
  onSubmit,
  initialData = null,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    program_name: initialData?.program_name || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "Beginner",
    duration_weeks: initialData?.duration_weeks || "",
    days_per_week: initialData?.days_per_week || "",
    status: initialData?.status || "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      ...formData,
      duration_weeks: Number(formData.duration_weeks),
      days_per_week: Number(formData.days_per_week),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="management-form">
      <h2>{initialData ? "Edit Workout Program" : "Add Workout Program"}</h2>

      <label htmlFor="program_name">Program Name</label>
      <input
        id="program_name"
        name="program_name"
        value={formData.program_name}
        onChange={handleChange}
        placeholder="e.g. Beginner Strength Training"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the workout program"
        rows="3"
      />

      <label htmlFor="difficulty">Difficulty</label>
      <select
        id="difficulty"
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <label htmlFor="duration_weeks">Duration (weeks)</label>
      <input
        id="duration_weeks"
        name="duration_weeks"
        type="number"
        min="1"
        value={formData.duration_weeks}
        onChange={handleChange}
        placeholder="e.g. 8"
        required
      />

      <label htmlFor="days_per_week">Training Days per Week</label>
      <input
        id="days_per_week"
        name="days_per_week"
        type="number"
        min="1"
        max="7"
        value={formData.days_per_week}
        onChange={handleChange}
        placeholder="e.g. 4"
        required
      />

      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <div className="form-actions">
        <button type="submit">
          {initialData ? "Update Workout Program" : "Add Workout Program"}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}