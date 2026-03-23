import { useState, useRef } from 'react'
import {
  parseCandidateCSV,
  saveCandidates,
  getCandidates,
  generateAssessmentLink,
  deleteCandidate,
} from '../lib/candidates'
import { sendAssessmentEmail } from '../lib/resend'
import CandidateTable from '../components/CandidateTable'
import CandidateForm from '../components/CandidateForm'

export default function Dashboard() {
  const [candidates, setCandidates] = useState(() => getCandidates())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRef = useRef(null)

  const handleAddCandidate = (candidateData) => {
    const newCandidates = [...candidates, candidateData]
    setCandidates(newCandidates)
    saveCandidates(newCandidates)
    setShowForm(false)
    setMessage({ type: 'success', text: 'Candidate added successfully!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result
        const parsedCandidates = parseCandidateCSV(csv)
        const newCandidates = [...candidates, ...parsedCandidates]
        setCandidates(newCandidates)
        saveCandidates(newCandidates)
        setMessage({
          type: 'success',
          text: `Successfully imported ${parsedCandidates.length} candidates!`,
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to parse CSV file. Please check the format.' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSendInvite = async (candidateId) => {
    const candidate = candidates.find((c) => c.id === candidateId)
    if (!candidate) return

    setLoading(true)
    try {
      const assessmentLink = generateAssessmentLink(candidate.token)
      await sendAssessmentEmail(
        candidate.email,
        candidate.name,
        assessmentLink,
        candidate.position || 'Software Engineer',
      )
      setMessage({ type: 'success', text: `Invitation sent to ${candidate.email}!` })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send invitation. Please check the email address.',
      })
    } finally {
      setLoading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleDeleteCandidate = (candidateId) => {
    const newCandidates = candidates.filter((c) => c.id !== candidateId)
    setCandidates(newCandidates)
    saveCandidates(newCandidates)
    deleteCandidate(candidateId)
    setMessage({ type: 'success', text: 'Candidate removed.' })
    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-neutral-0)',
          padding: 'var(--spacing-2xl)',
          borderBottom: '1px solid var(--color-primary-light)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--color-accent)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              H
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>HireIQ</h1>
          </div>
          <p style={{ margin: 'var(--spacing-md) 0 0 0', opacity: 0.9 }}>
            Voice Assessment Platform for Candidate Evaluation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--spacing-2xl)' }}>
        {/* Message Alert */}
        {message.text && (
          <div
            style={{
              padding: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xl)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor:
                message.type === 'success'
                  ? '#f0fdf4'
                  : message.type === 'error'
                    ? '#fef2f2'
                    : 'var(--color-neutral-100)',
              color:
                message.type === 'success'
                  ? '#15803d'
                  : message.type === 'error'
                    ? '#991b1b'
                    : 'var(--color-text-primary)',
              borderLeft: `4px solid ${
                message.type === 'success'
                  ? 'var(--color-success)'
                  : message.type === 'error'
                    ? 'var(--color-error)'
                    : 'var(--color-neutral-400)'
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Action Bar */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-2xl)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
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
            {showForm ? 'Cancel' : 'Add Candidate'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-neutral-200)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-neutral-300)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-neutral-200)'
            }}
          >
            Import CSV
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div style={{ flex: 1 }} />

          <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Total Candidates: <strong>{candidates.length}</strong>
          </span>
        </div>

        {/* Add Candidate Form */}
        {showForm && (
          <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <CandidateForm
              onSubmit={handleAddCandidate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Candidates Table */}
        <div
          style={{
            backgroundColor: 'var(--color-neutral-0)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
          }}
        >
          {candidates.length === 0 ? (
            <div
              style={{
                padding: 'var(--spacing-3xl)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <p style={{ margin: 0, marginBottom: 'var(--spacing-md)' }}>
                No candidates added yet.
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Add candidates manually or import a CSV file to get started.
              </p>
            </div>
          ) : (
            <CandidateTable
              candidates={candidates}
              onSendInvite={handleSendInvite}
              onDelete={handleDeleteCandidate}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  )
}
