import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    setErrors({
      ...errors,
      [e.target.name]: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!form.email) {
      newErrors.email = 'Email is required.'
    }

    if (!form.password) {
      newErrors.password = 'Password is required.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await login(form.email, form.password)

      if (response.user.role === 'admin') {
        navigate('/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(
          error.response.data.errors || {
            email: ['The provided credentials are incorrect.'],
          },
        )
      } else {
        setErrors({
          general: 'Unable to connect to the server.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Prime Fitness</h1>
          <p>Membership & Workout Management System</p>
        </div>

        <h2>Welcome Back</h2>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {errors.email && (
              <small className="field-error">
                {Array.isArray(errors.email)
                  ? errors.email[0]
                  : errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {errors.password && (
              <small className="field-error">
                {Array.isArray(errors.password)
                  ? errors.password[0]
                  : errors.password}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login