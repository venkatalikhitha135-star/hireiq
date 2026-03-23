import { useState } from 'react'
import useSpeech from '../hooks/useSpeech'

export default function RecordingButton({ onRecordingComplete }) {
  const { startRecording, stopRecording } = useSpeech()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const handleStart = async () => {
    try {
      await startRecording()
      setIsRecording(true)
      setRecordingTime(0)
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      window.recordingInterval = interval
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const handleStop = async () => {
    try {
      clearInterval(window.recordingInterval)
      setIsRecording(false)
      const audioBlob = await stopRecording()

      // For now, we'll just pass a simulated response
      const response = {
        audioBlob,
        duration: recordingTime,
        timestamp: new Date().toISOString(),
      }

      onRecordingComplete(response)
      setRecordingTime(0)
    } catch (error) {
      console.error('Failed to stop recording:', error)
      setIsRecording(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
      <button
        onClick={isRecording ? handleStop : handleStart}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isRecording ? 'var(--color-error)' : 'var(--color-accent)',
          color: 'var(--color-neutral-0)',
          fontSize: '32px',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          boxShadow: isRecording ? 'var(--shadow-lg)' : 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
          e.target.style.boxShadow = 'var(--shadow-xl)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = isRecording ? 'var(--shadow-lg)' : 'var(--shadow-md)'
        }}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>

      {isRecording && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: '#fef2f2',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-error)',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--color-error)',
              borderRadius: '50%',
              animation: 'pulse 1s infinite',
            }}
          />
          <span style={{ color: 'var(--color-error)', fontWeight: '600' }}>
            Recording: {formatTime(recordingTime)}
          </span>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '300px' }}>
        {isRecording
          ? 'Recording your response... Click the button again to stop.'
          : 'Click the microphone button to start recording your answer.'}
      </p>
    </div>
  )
}
