import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useSpeech from '../hooks/useSpeech'
import { getCandidateByToken, updateCandidateAssessment } from '../lib/candidates'
import AssessmentQuestion from '../components/AssessmentQuestion'
import RecordingButton from '../components/RecordingButton'

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'Tell us about your professional background and key achievements.',
    duration: 60,
  },
  {
    id: 2,
    question: 'How do you approach problem-solving in a team environment?',
    duration: 45,
  },
  {
    id: 3,
    question: 'Describe a challenge you faced and how you overcame it.',
    duration: 60,
  },
  {
    id: 4,
    question: 'What are your career goals and how does this role align with them?',
    duration: 45,
  },
  {
    id: 5,
    question: 'Do you have any questions for us about the role or company?',
    duration: 30,
  },
]

export default function VoiceBot() {
  const { assessmentId } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState([])
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isListening, transcript, error: speechError, speak, startListening, stopListening, resetTranscript } = useSpeech()

  useEffect(() => {
    const cand = getCandidateByToken(assessmentId)
    if (!cand) {
      setError('Invalid assessment link. Please check your invitation email.')
      setLoading(false)
    } else {
      setCandidate(cand)
      setLoading(false)
    }
  }, [assessmentId])

  const handleStartAssessment = () => {
    if (!candidate) return
    setAssessmentStarted(true)
    setTimeout(() => {
      speak(`Welcome to the HireIQ assessment, ${candidate.name}. Let's begin with the first question.`)
      setTimeout(() => {
        speak(ASSESSMENT_QUESTIONS[0].question)
      }, 2000)
    }, 500)
  }

  const handleRecordingComplete = (response) => {
    const updatedResponses = [...responses, {
      questionId: ASSESSMENT_QUESTIONS[currentQuestion].id,
      question: ASSESSMENT_QUESTIONS[currentQuestion].question,
      response,
      timestamp: new Date().toISOString(),
    }]
    setResponses(updatedResponses)

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      resetTranscript()
      setTimeout(() => {
        speak(`Great, let's move to the next question.`)
        setTimeout(() => {
          speak(ASSESSMENT_QUESTIONS[currentQuestion + 1].question)
        }, 1500)
      }, 1000)
    } else {
      completeAssessment(updatedResponses)
    }
  }

  const completeAssessment = (finalResponses) => {
    if (!candidate) return

    const assessmentData = {
      responses: finalResponses,
      totalQuestions: ASSESSMENT_QUESTIONS.length,
      questionsAnswered: finalResponses.length,
      duration: `${Math.floor(finalResponses.length * 2)} minutes`,
    }

    updateCandidateAssessment(candidate.token, assessmentData)
    setAssessmentCompleted(true)
    speak('Thank you for completing the assessment. Your responses have been recorded.')
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--color-neutral-200)',
              borderTop: '4px solid var(--color-accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--spacing-lg)',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            padding: 'var(--spacing-xl)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#991b1b', marginTop: 0 }}>Assessment Error</h2>
          <p style={{ color: '#7c2d12', margin: 'var(--spacing-md) 0' }}>{error}</p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (assessmentCompleted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            padding: 'var(--spacing-3xl)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            ✓
          </div>
          <h2 style={{ color: '#15803d', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>
            Assessment Complete!
          </h2>
          <p style={{ color: '#4b5563', marginBottom: 'var(--spacing-lg)' }}>
            Thank you for completing the HireIQ assessment, {candidate.name}. Your responses have
            been recorded and will be reviewed by our hiring team.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            You'll hear from us within 2-3 business days.
          </p>
        </div>
      </div>
    )
  }

  if (!assessmentStarted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-neutral-0)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--spacing-3xl)',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginTop: 0, color: 'var(--color-primary)' }}>
            Welcome, {candidate?.name}!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            You're about to complete the HireIQ voice assessment. You'll answer {ASSESSMENT_QUESTIONS.length} questions, each with a suggested time limit.
          </p>

          <div
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-xl)',
              textAlign: 'left',
            }}
          >
            <p style={{ margin: '0 0 var(--spacing-md) 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Before you start:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-secondary)' }}>
              <li>Find a quiet space for better audio quality</li>
              <li>Allow microphone access when prompted</li>
              <li>Speak clearly and naturally</li>
              <li>You can review and re-record each response</li>
            </ul>
          </div>

          <button
            onClick={handleStartAssessment}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-neutral-0)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-accent)')}
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background-secondary)',
        padding: 'var(--spacing-xl)',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-neutral-0)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--spacing-2xl)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 'var(--spacing-md)' }}>Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</h1>
        <div
          style={{
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--color-accent)',
              width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`,
              transition: 'width var(--transition-normal)',
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <AssessmentQuestion
          question={ASSESSMENT_QUESTIONS[currentQuestion].question}
          duration={ASSESSMENT_QUESTIONS[currentQuestion].duration}
          onRecordingComplete={handleRecordingComplete}
        />

        {/* Recording Button and Status */}
        <div
          style={{
            backgroundColor: 'var(--color-neutral-0)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-2xl)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            marginTop: 'var(--spacing-2xl)',
          }}
        >
          <RecordingButton
            onRecordingComplete={handleRecordingComplete}
          />

          {speechError && (
            <p style={{ color: 'var(--color-error)', marginTop: 'var(--spacing-md)', fontSize: '14px' }}>
              {speechError}
            </p>
          )}

          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-lg)', fontSize: '14px' }}>
            {isListening ? 'Listening... Speak now.' : 'Click the button above to start recording your response.'}
          </p>
        </div>
      </div>
    </div>
  )
}
