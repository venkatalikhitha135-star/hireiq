import { useState } from 'react'
import { generateToken } from '../lib/candidates'

export default function CandidateForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.position) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      id: generateToken(),
      token: generateToken(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    setFormData({ name: '', email: '', position: '', phone: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--color-neutral-0)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Add New Candidate</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
            }}
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
            }}
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="position"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
            }}
          >
            Position *
          </label>
          <input
            id="position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Software Engineer"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
            }}
          >
            Phone (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-neutral-200)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-neutral-300)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-neutral-200)')}
        >
          Cancel
        </button>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-neutral-0)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-accent-hover)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-accent)')}
        >
          Add Candidate
        </button>
      </div>
    </form>
  )
}
