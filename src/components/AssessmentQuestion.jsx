import { useState, useEffect } from 'react'

export default function AssessmentQuestion({ question, duration }) {
  const [timeRemaining, setTimeRemaining] = useState(duration)

  useEffect(() => {
    setTimeRemaining(duration)
  }, [duration])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-neutral-0)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-2xl)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h2
          style={{
            margin: 0,
            color: 'var(--color-primary)',
            fontSize: '20px',
            fontWeight: '700',
            flex: 1,
            lineHeight: '1.5',
          }}
        >
          {question}
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 'var(--spacing-lg)',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: timeRemaining <= 10 ? 'var(--color-error)' : 'var(--color-accent)',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {formatTime(timeRemaining)}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            Time remaining
          </p>
        </div>
      </div>

      <div
        style={{
          height: '4px',
          backgroundColor: 'var(--color-neutral-200)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: timeRemaining <= 10 ? 'var(--color-error)' : 'var(--color-accent)',
            width: `${(timeRemaining / duration) * 100}%`,
            transition: 'width 1s linear',
          }}
        />
      </div>

      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-lg)', fontSize: '14px' }}>
        Suggested duration: {duration} seconds
      </p>
    </div>
  )
}
