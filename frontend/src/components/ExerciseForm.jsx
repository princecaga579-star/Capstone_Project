
import { useState } from "react";

export default function ExerciseForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState({
    exercise_name: initialData?.exercise_name || "",
    description: initialData?.description || "",
    muscle_group: initialData?.muscle_group || "",
    difficulty: initialData?.difficulty || "Beginner",
    duration: initialData?.duration || "",
    calories_burned: initialData?.calories_burned || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      ...formData,
      duration: Number(formData.duration),
      calories_burned: Number(formData.calories_burned),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="management-form">
      <h2>{initialData ? "Edit Exercise" : "Add Exercise"}</h2>

      <label htmlFor="exercise_name">Exercise Name</label>
      <input
        id="exercise_name"
        name="exercise_name"
        value={formData.exercise_name}
        onChange={handleChange}
        placeholder="e.g. Push-ups"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the exercise"
        rows="3"
      />

      <label htmlFor="muscle_group">Muscle Group</label>
      <select
        id="muscle_group"
        name="muscle_group"
        value={formData.muscle_group}
        onChange={handleChange}
        required
      >
        <option value="">Select muscle group</option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Arms">Arms</option>
        <option value="Legs">Legs</option>
        <option value="Core">Core</option>
        <option value="Full Body">Full Body</option>
      </select>

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

      <label htmlFor="duration">Duration (minutes)</label>
      <input
        id="duration"
        name="duration"
        type="number"
        min="1"
        value={formData.duration}
        onChange={handleChange}
        placeholder="e.g. 15"
        required
      />

      <label htmlFor="calories_burned">Estimated Calories Burned</label>
      <input
        id="calories_burned"
        name="calories_burned"
        type="number"
        min="0"
        value={formData.calories_burned}
        onChange={handleChange}
        placeholder="e.g. 100"
        required
      />

      <div className="form-actions">
        <button type="submit">
          {initialData ? "Update Exercise" : "Add Exercise"}
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