import { useEffect, useState } from 'react'
import api from '../services/api'

function WorkoutProgramForm({
  program,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    difficulty: 'Beginner',
    duration: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (program) {
      setForm({
        name: program.name || '',
        description: program.description || '',
        difficulty: program.difficulty || 'Beginner',
        duration: program.duration || '',
      })
    } else {
      setForm({
        name: '',
        description: '',
        difficulty: 'Beginner',
        duration: '',
      })
    }

    setErrors({})
  }, [program])

  const isEditing = Boolean(program)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = {}

    if (!form.name.trim()) {
      validationErrors.name =
        'Workout program name is required.'
    }

    if (!form.duration) {
      validationErrors.duration =
        'Duration is required.'
    } else if (Number(form.duration) < 1) {
      validationErrors.duration =
        'Duration must be at least 1 minute.'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      setErrors({})

      const data = {
        name: form.name,
        description: form.description,
        difficulty: form.difficulty,
        duration: Number(form.duration),
      }

      if (isEditing) {
        await api.put(
          `/workout-programs/${program.id}`,
          data,
        )

        onSuccess(
          'Workout program updated successfully.',
        )
      } else {
        await api.post(
          '/workout-programs',
          data,
        )

        onSuccess(
          'Workout program created successfully.',
        )
      }
    } catch (error) {
      console.error(
        'Workout program save error:',
        error,
      )

      if (error.response?.status === 422) {
        setErrors(
          error.response.data.errors || {},
        )
      } else {
        setErrors({
          general: isEditing
            ? 'Failed to update workout program.'
            : 'Failed to create workout program.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">

      <div className="form-header">
        <h3>
          {isEditing
            ? 'Edit Workout Program'
            : 'Add New Workout Program'}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          className="close-button"
        >
          ×
        </button>
      </div>

      {errors.general && (
        <div className="error-message">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Program Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Full Body Strength"
          />

          {errors.name && (
            <small className="field-error">
              {Array.isArray(errors.name)
                ? errors.name[0]
                : errors.name}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the workout program..."
            rows="4"
          />

          {errors.description && (
            <small className="field-error">
              {Array.isArray(errors.description)
                ? errors.description[0]
                : errors.description}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Difficulty</label>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>
          </select>

          {errors.difficulty && (
            <small className="field-error">
              {Array.isArray(errors.difficulty)
                ? errors.difficulty[0]
                : errors.difficulty}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>

          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            min="1"
          />

          {errors.duration && (
            <small className="field-error">
              {Array.isArray(errors.duration)
                ? errors.duration[0]
                : errors.duration}
            </small>
          )}
        </div>

        <div className="form-actions">

          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update Workout Program'
                : 'Create Workout Program'}
          </button>

        </div>

      </form>
    </div>
  )
}

export default WorkoutProgramForm