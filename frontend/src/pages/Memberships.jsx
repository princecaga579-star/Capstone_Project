import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import MembershipForm from '../components/MembershipForm'

function Memberships() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [memberships, setMemberships] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  })

  const [showForm, setShowForm] = useState(false)

  const [editingMembership, setEditingMembership] =
    useState(null)

  const fetchMemberships = async (
    pageNumber = 1,
  ) => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(
        '/memberships',
        {
          params: {
            search,
            status,
            page: pageNumber,
          },
        },
      )

      setMemberships(response.data.data)

      setPagination({
        current_page:
          response.data.meta.current_page,

        last_page:
          response.data.meta.last_page,
      })

      setPage(pageNumber)
    } catch (err) {
      console.error(err)
      setError(
        'Failed to load memberships.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemberships(1)
  }, [search, status])

  const handleCreateSuccess = (
    message,
  ) => {
    setShowForm(false)
    setEditingMembership(null)

    setSuccess(message)
    setError('')

    fetchMemberships(1)

    setTimeout(() => {
      setSuccess('')
    }, 3000)
  }

  const handleEdit = (membership) => {
    setEditingMembership(membership)
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
    setEditingMembership(null)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this membership?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await api.delete(
        `/memberships/${id}`,
      )

      setSuccess(
        'Membership deleted successfully.',
      )

      fetchMemberships(page)

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error(err)

      setError(
        'Failed to delete membership.',
      )
    }
  }

  const handleStatusChange = async (
    id,
    newStatus,
  ) => {
    try {
      setError('')
      setSuccess('')

      await api.patch(
        `/memberships/${id}/status`,
        {
          status: newStatus,
        },
      )

      setSuccess(
        'Membership status updated successfully.',
      )

      fetchMemberships(page)

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error(err)

      if (
        err.response?.status === 422
      ) {
        setError(
          err.response.data.errors
            ?.status?.[0] ||
            'Invalid membership status.',
        )
      } else {
        setError(
          'Failed to update membership status.',
        )
      }
    }
  }

  return (
    <div className="page-container">

      {/* Header */}
      <header className="page-header">

        <div>
          <h1>Prime Fitness</h1>

          <p>
            Membership Management
          </p>
        </div>

        <a href="/dashboard">
          ← Dashboard
        </a>

      </header>

      <main className="page-content">

        {/* Page title */}
        <div className="page-title">

          <div>
            <h2>Memberships</h2>

            <p>
              Manage Prime Fitness
              member memberships.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingMembership(null)
                setShowForm(true)

                setError('')
                setSuccess('')
              }}
            >
              + Add Membership
            </button>
          )}

        </div>

        {/* Membership form */}
        {showForm && isAdmin && (
          <MembershipForm
            membership={
              editingMembership
            }
            onSuccess={
              handleCreateSuccess
            }
            onCancel={
              handleCancelForm
            }
          />
        )}

        {/* Success message */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Search and filter */}
        <div className="filters">

          <input
            type="text"
            placeholder="Search member or membership type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="active">
              Active
            </option>

            <option value="expired">
              Expired
            </option>
          </select>

        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">
            Loading memberships...
          </div>
        ) : memberships.length === 0 ? (
          <div className="empty-state">
            No memberships found.
          </div>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>

                  <th>ID</th>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Amount</th>

                  {isAdmin && (
                    <th>Actions</th>
                  )}

                </tr>
              </thead>

              <tbody>

                {memberships.map(
                  (membership) => (
                    <tr
                      key={
                        membership.id
                      }
                    >

                      <td>
                        {membership.id}
                      </td>

                      <td>
                        {membership.member
                          ?.name ||
                          'Unknown'}
                      </td>

                      <td>
                        {membership.member
                          ?.email ||
                          '-'}
                      </td>

                      <td>
                        {
                          membership.membership_type
                        }
                      </td>

                      <td>
                        {
                          membership.start_date
                        }
                      </td>

                      <td>
                        {
                          membership.end_date
                        }
                      </td>

                      <td>

                        {isAdmin ? (
                          <select
                            value={
                              membership.status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                membership.id,
                                e.target.value,
                              )
                            }
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="active">
                              Active
                            </option>

                            <option value="expired">
                              Expired
                            </option>

                          </select>
                        ) : (
                          membership.status
                        )}

                      </td>

                      <td>
                        ₱
                        {Number(
                          membership.amount,
                        ).toFixed(2)}
                      </td>

                      {isAdmin && (
                        <td>

                          <button
                            onClick={() =>
                              handleEdit(
                                membership,
                              )
                            }
                          >
                            Edit
                          </button>

                          {' '}

                          <button
                            onClick={() =>
                              handleDelete(
                                membership.id,
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

        {/* Pagination */}
        {!loading &&
          pagination.last_page > 1 && (
            <div className="pagination">

              <button
                disabled={page === 1}
                onClick={() =>
                  fetchMemberships(
                    page - 1,
                  )
                }
              >
                Previous
              </button>

              <span>
                Page{' '}
                {pagination.current_page}{' '}
                of{' '}
                {pagination.last_page}
              </span>

              <button
                disabled={
                  page ===
                  pagination.last_page
                }
                onClick={() =>
                  fetchMemberships(
                    page + 1,
                  )
                }
              >
                Next
              </button>

            </div>
          )}

      </main>

    </div>
  )
}

export default Memberships