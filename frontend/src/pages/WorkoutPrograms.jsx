import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import WorkoutProgramForm from '../components/WorkoutProgramForm'

function WorkoutPrograms() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/workout-programs')

      setPrograms(response.data.data || response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load workout programs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const handleFormSuccess = (message) => {
    setShowForm(false)
    setEditingProgram(null)
    setSuccess(message)
    setError('')

    fetchPrograms()

    setTimeout(() => {
      setSuccess('')
    }, 3000)
  }

  const handleEdit = (program) => {
    setEditingProgram(program)
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
    setEditingProgram(null)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this workout program?',
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      await api.delete(`/workout-programs/${id}`)

      setSuccess(
        'Workout program deleted successfully.',
      )

      fetchPrograms()

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error(err)
      setError(
        'Failed to delete workout program.',
      )
    }
  }

  const filteredPrograms = programs.filter(
    (program) => {
      const matchesSearch =
        program.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (program.description || '')
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesDifficulty =
        !difficulty ||
        program.difficulty === difficulty

      return (
        matchesSearch &&
        matchesDifficulty
      )
    },
  )

  return (
    <div className="page-container">

      <header className="page-header">
        <div>
          <h1>Prime Fitness</h1>
          <p>Workout Program Management</p>
        </div>

        <a href="/dashboard">
          ← Dashboard
        </a>
      </header>

      <main className="page-content">

        <div className="page-title">
          <div>
            <h2>Workout Programs</h2>

            <p>
              Manage Prime Fitness workout programs.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingProgram(null)
                setShowForm(true)
                setError('')
                setSuccess('')
              }}
            >
              + Add Workout Program
            </button>
          )}
        </div>

        {showForm && isAdmin && (
          <WorkoutProgramForm
            program={editingProgram}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        )}

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

        <div className="filters">

          <input
            type="text"
            placeholder="Search workout programs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >
            <option value="">
              All Difficulties
            </option>

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

        </div>

        {loading ? (
          <div className="loading">
            Loading workout programs...
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="empty-state">
            No workout programs found.
          </div>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Program</th>
                  <th>Description</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Exercises</th>

                  {isAdmin && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>

                {filteredPrograms.map(
                  (program) => (
                    <tr key={program.id}>

                      <td>
                        {program.id}
                      </td>

                      <td>
                        {program.name}
                      </td>

                      <td>
                        {program.description ||
                          '-'}
                      </td>

                      <td>
                        {program.difficulty}
                      </td>

                      <td>
                        {program.duration} min
                      </td>

                      <td>
                        {program.exercises
                          ? program.exercises.length
                          : 0}
                      </td>

                      {isAdmin && (
                        <td>

                          <button
                            onClick={() =>
                              handleEdit(program)
                            }
                          >
                            Edit
                          </button>

                          {' '}

                          <button
                            onClick={() =>
                              handleDelete(
                                program.id,
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

      </main>
    </div>
  )
}

export default WorkoutPrograms