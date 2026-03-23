import { generateAssessmentLink } from '../lib/candidates'

export default function CandidateTable({ candidates, onSendInvite, onDelete, loading }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981'
      case 'in-progress':
        return '#f59e0b'
      case 'pending':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            <th
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'left',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'left',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'left',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              Position
            </th>
            <th
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'left',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'right',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr
              key={candidate.id}
              style={{
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: index % 2 === 0 ? 'var(--color-neutral-0)' : 'var(--color-neutral-50)',
              }}
            >
              <td style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {candidate.name}
                </div>
              </td>
              <td style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  {candidate.email}
                </div>
              </td>
              <td style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  {candidate.position}
                </div>
              </td>
              <td style={{ padding: 'var(--spacing-lg)' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: '4px 12px',
                    backgroundColor: `${getStatusColor(candidate.status)}20`,
                    color: getStatusColor(candidate.status),
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: getStatusColor(candidate.status),
                      borderRadius: '50%',
                    }}
                  />
                  {getStatusLabel(candidate.status)}
                </div>
              </td>
              <td style={{ padding: 'var(--spacing-lg)', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      const assessmentLink = generateAssessmentLink(candidate.token)
                      navigator.clipboard.writeText(assessmentLink)
                      alert('Assessment link copied to clipboard!')
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-accent)',
                      border: '1px solid var(--color-accent)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-accent)'
                      e.target.style.color = 'var(--color-neutral-0)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = 'var(--color-accent)'
                    }}
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => onSendInvite(candidate.id)}
                    disabled={loading || candidate.status !== 'pending'}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: candidate.status !== 'pending' ? 'var(--color-neutral-300)' : 'var(--color-accent)',
                      color: 'var(--color-neutral-0)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: candidate.status !== 'pending' ? 'not-allowed' : 'pointer',
                      transition: 'background-color var(--transition-fast)',
                      opacity: candidate.status !== 'pending' ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (candidate.status === 'pending') {
                        e.target.style.backgroundColor = 'var(--color-accent-hover)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (candidate.status === 'pending') {
                        e.target.style.backgroundColor = 'var(--color-accent)'
                      }
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Invite'}
                  </button>

                  <button
                    onClick={() => onDelete(candidate.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-error)',
                      border: '1px solid var(--color-error)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-error)'
                      e.target.style.color = 'var(--color-neutral-0)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = 'var(--color-error)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
