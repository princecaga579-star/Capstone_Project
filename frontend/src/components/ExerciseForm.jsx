import { useEffect, useState } from 'react'
import api from '../services/api'

function ExerciseForm({
  exercise,
  programs,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState({
    workout_program_id: '',
    name: '',
    description: '',
    sets: '',
    reps: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (exercise) {
      setForm({
        workout_program_id:
          exercise.workout_program_id || '',
        name: exercise.name || '',
        description: exercise.description || '',
        sets: exercise.sets || '',
        reps: exercise.reps || '',
      })
    } else {
      setForm({
        workout_program_id: '',
        name: '',
        description: '',
        sets: '',
        reps: '',
      })
    }

    setErrors({})
  }, [exercise])

  const isEditing = Boolean(exercise)

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

    if (!form.workout_program_id) {
      validationErrors.workout_program_id =
        'Workout program is required.'
    }

    if (!form.name.trim()) {
      validationErrors.name =
        'Exercise name is required.'
    }

    if (!form.sets) {
      validationErrors.sets =
        'Number of sets is required.'
    } else if (Number(form.sets) < 1) {
      validationErrors.sets =
        'Sets must be at least 1.'
    }

    if (!form.reps) {
      validationErrors.reps =
        'Number of reps is required.'
    } else if (Number(form.reps) < 1) {
      validationErrors.reps =
        'Reps must be at least 1.'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      setErrors({})

      const data = {
        workout_program_id: Number(
          form.workout_program_id,
        ),
        name: form.name,
        description: form.description,
        sets: Number(form.sets),
        reps: Number(form.reps),
      }

      if (isEditing) {
        await api.put(
          `/exercises/${exercise.id}`,
          data,
        )

        onSuccess('Exercise updated successfully.')
      } else {
        await api.post('/exercises', data)

        onSuccess('Exercise created successfully.')
      }
    } catch (error) {
      console.error('Exercise save error:', error)

      if (error.response?.status === 422) {
        setErrors(
          error.response.data.errors || {},
        )
      } else {
        setErrors({
          general: isEditing
            ? 'Failed to update exercise.'
            : 'Failed to create exercise.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h2>
        {isEditing
          ? 'Edit Exercise'
          : 'Add Exercise'}
      </h2>

      {errors.general && (
        <p className="error-message">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Workout Program</label>

          <select
            name="workout_program_id"
            value={form.workout_program_id}
            onChange={handleChange}
          >
            <option value="">
              Select Workout Program
            </option>

            {programs.map((program) => (
              <option
                key={program.id}
                value={program.id}
              >
                {program.name}
              </option>
            ))}
          </select>

          {errors.workout_program_id && (
            <p className="error-message">
              {errors.workout_program_id}
            </p>
          )}
        </div>

        <div>
          <label>Exercise Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Bench Press"
          />

          {errors.name && (
            <p className="error-message">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the exercise"
            rows="3"
          />

          {errors.description && (
            <p className="error-message">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label>Sets</label>

          <input
            type="number"
            name="sets"
            value={form.sets}
            onChange={handleChange}
            min="1"
            placeholder="Example: 3"
          />

          {errors.sets && (
            <p className="error-message">
              {errors.sets}
            </p>
          )}
        </div>

        <div>
          <label>Reps</label>

          <input
            type="number"
            name="reps"
            value={form.reps}
            onChange={handleChange}
            min="1"
            placeholder="Example: 10"
          />

          {errors.reps && (
            <p className="error-message">
              {errors.reps}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : isEditing
                ? 'Update Exercise'
                : 'Add Exercise'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExerciseForm