import { useEffect, useState } from 'react'
import api from '../services/api'

function MembershipForm({
  membership,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState({
    user_id: '',
    membership_type: 'Monthly',
    start_date: '',
    end_date: '',
    status: 'pending',
    amount: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Fill the form when editing
  useEffect(() => {
    if (membership) {
      setForm({
        user_id: membership.user_id || '',
        membership_type:
          membership.membership_type || 'Monthly',
        start_date:
          membership.start_date || '',
        end_date:
          membership.end_date || '',
        status:
          membership.status || 'pending',
        amount:
          membership.amount || '',
      })
    } else {
      setForm({
        user_id: '',
        membership_type: 'Monthly',
        start_date: '',
        end_date: '',
        status: 'pending',
        amount: '',
      })
    }

    setErrors({})
  }, [membership])

  const isEditing = Boolean(membership)

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

    if (!form.user_id) {
      validationErrors.user_id =
        'Member ID is required.'
    }

    if (!form.membership_type) {
      validationErrors.membership_type =
        'Membership type is required.'
    }

    if (!form.start_date) {
      validationErrors.start_date =
        'Start date is required.'
    }

    if (!form.end_date) {
      validationErrors.end_date =
        'End date is required.'
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      validationErrors.end_date =
        'End date must be after or equal to the start date.'
    }

    if (!form.amount) {
      validationErrors.amount =
        'Amount is required.'
    }

    if (
      form.amount &&
      Number(form.amount) < 0
    ) {
      validationErrors.amount =
        'Amount cannot be negative.'
    }

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      setErrors({})

      const data = {
        user_id: Number(form.user_id),
        membership_type: form.membership_type,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        amount: Number(form.amount),
      }

      if (isEditing) {
        // UPDATE
        await api.put(
          `/memberships/${membership.id}`,
          data,
        )

        onSuccess(
          'Membership updated successfully.',
        )
      } else {
        // CREATE
        await api.post(
          '/memberships',
          data,
        )

        onSuccess(
          'Membership created successfully.',
        )
      }
    } catch (error) {
      console.error(
        'Membership save error:',
        error,
      )

      if (
        error.response?.status === 422
      ) {
        setErrors(
          error.response.data.errors || {},
        )
      } else {
        setErrors({
          general: isEditing
            ? 'Failed to update membership.'
            : 'Failed to create membership.',
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
            ? 'Edit Membership'
            : 'Add New Membership'}
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

        {/* Member ID */}
        <div className="form-group">
          <label>Member ID</label>

          <input
            type="number"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            min="1"
          />

          {errors.user_id && (
            <small className="field-error">
              {Array.isArray(errors.user_id)
                ? errors.user_id[0]
                : errors.user_id}
            </small>
          )}
        </div>

        {/* Membership Type */}
        <div className="form-group">
          <label>Membership Type</label>

          <select
            name="membership_type"
            value={form.membership_type}
            onChange={handleChange}
          >
            <option value="Monthly">
              Monthly
            </option>

            <option value="Quarterly">
              Quarterly
            </option>

            <option value="Semi-Annual">
              Semi-Annual
            </option>

            <option value="Annual">
              Annual
            </option>
          </select>

          {errors.membership_type && (
            <small className="field-error">
              {Array.isArray(
                errors.membership_type,
              )
                ? errors.membership_type[0]
                : errors.membership_type}
            </small>
          )}
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />

          {errors.start_date && (
            <small className="field-error">
              {Array.isArray(
                errors.start_date,
              )
                ? errors.start_date[0]
                : errors.start_date}
            </small>
          )}
        </div>

        {/* End Date */}
        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
          />

          {errors.end_date && (
            <small className="field-error">
              {Array.isArray(errors.end_date)
                ? errors.end_date[0]
                : errors.end_date}
            </small>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
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
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

          {errors.amount && (
            <small className="field-error">
              {Array.isArray(errors.amount)
                ? errors.amount[0]
                : errors.amount}
            </small>
          )}
        </div>

        {/* Buttons */}
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
                ? 'Update Membership'
                : 'Create Membership'}
          </button>

        </div>

      </form>
    </div>
  )
}

export default MembershipForm