import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import ExerciseForm from '../components/ExerciseForm'

function Exercises() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [exercises, setExercises] = useState([])
  const [programs, setPrograms] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [programFilter, setProgramFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingExercise, setEditingExercise] =
    useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [exerciseResponse, programResponse] =
        await Promise.all([
          api.get('/exercises'),
          api.get('/workout-programs'),
        ])

      setExercises(
        exerciseResponse.data.data ||
          exerciseResponse.data,
      )

      setPrograms(
        programResponse.data.data ||
          programResponse.data,
      )
    } catch (err) {
      console.error(err)
      setError('Failed to load exercises.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFormSuccess = (message) => {
    setShowForm(false)
    setEditingExercise(null)
    setSuccess(message)
    setError('')

    fetchData()

    setTimeout(() => {
      setSuccess('')
    }, 3000)
  }

  const handleEdit = (exercise) => {
    setEditingExercise(exercise)
    setShowForm(true)
    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingExercise(null)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this exercise?',
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      await api.delete(`/exercises/${id}`)

      setSuccess(
        'Exercise deleted successfully.',
      )

      fetchData()

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error(err)

      setError(
        'Failed to delete exercise.',
      )
    }
  }

  const filteredExercises = exercises.filter(
    (exercise) => {
      const searchText =
        search.toLowerCase()

      const matchesSearch =
        exercise.name
          .toLowerCase()
          .includes(searchText) ||
        (
          exercise.description || ''
        )
          .toLowerCase()
          .includes(searchText) ||
        (
          exercise.workout_program?.name || ''
        )
          .toLowerCase()
          .includes(searchText)

      const matchesProgram =
        !programFilter ||
        String(
          exercise.workout_program_id,
        ) === String(programFilter)

      return (
        matchesSearch &&
        matchesProgram
      )
    },
  )

  return (
    <div className="page-container">
      <h1>Exercises</h1>

      <p>
        Manage exercises and their workout
        programs.
      </p>

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isAdmin && (
        <button
          onClick={() => {
            setEditingExercise(null)
            setShowForm(true)
            setError('')
            setSuccess('')
          }}
        >
          + Add Exercise
        </button>
      )}

      {isAdmin && showForm && (
        <ExerciseForm
          exercise={editingExercise}
          programs={programs}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={programFilter}
          onChange={(e) =>
            setProgramFilter(e.target.value)
          }
        >
          <option value="">
            All Workout Programs
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
      </div>

      {loading ? (
        <p>Loading exercises...</p>
      ) : filteredExercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Exercise</th>
                <th>Workout Program</th>
                <th>Description</th>
                <th>Sets</th>
                <th>Reps</th>

                {isAdmin && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredExercises.map(
                (exercise) => (
                  <tr key={exercise.id}>
                    <td>{exercise.id}</td>

                    <td>
                      {exercise.name}
                    </td>

                    <td>
                      {exercise
                        .workout_program
                        ?.name ||
                        'Unknown'}
                    </td>

                    <td>
                      {exercise.description ||
                        'No description'}
                    </td>

                    <td>
                      {exercise.sets}
                    </td>

                    <td>
                      {exercise.reps}
                    </td>

                    {isAdmin && (
                      <td>
                        <button
                          onClick={() =>
                            handleEdit(
                              exercise,
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              exercise.id,
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Exercises