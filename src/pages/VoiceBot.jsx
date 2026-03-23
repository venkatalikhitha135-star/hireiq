import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Mic, Volume2, Check, Loader } from 'lucide-react'
import { useSpeech } from '../hooks/useSpeech'
import { calculateProbability } from '../lib/candidates'

const QUESTIONS = [
  'Are you still interested in joining our company?',
  'Have you received any other job offers recently?',
  'Is the compensation package meeting your expectations?',
  'Do you have any concerns about the role or the team?',
  'When are you expecting to start your new job?',
  'Would location or relocation be a challenge for you?',
]

export default function VoiceBot() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const candidateName = searchParams.get('name') || 'Candidate'
  const position = searchParams.get('pos') || 'Position'

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [probability, setProbability] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState(null)

  const { speak, listen, stopListening } = useSpeech()

  useEffect(() => {
    if (!token) {
      setError('Invalid access token. Please check your email link.')
      return
    }
    
    // Load saved results if they exist
    const saved = localStorage.getItem(`assessment-${token}`)
    if (saved) {
      const data = JSON.parse(saved)
      setAnswers(data.answers)
      setProbability(data.probability)
      setShowResult(true)
      setCurrentQuestion(QUESTIONS.length)
    } else {
      // Start the assessment
      askQuestion(0)
    }
  }, [token])

  const askQuestion = async (index) => {
    if (index >= QUESTIONS.length) {
      // Calculate probability
      const prob = calculateProbability(answers)
      setProbability(prob)
      
      // Save to localStorage
      localStorage.setItem(`assessment-${token}`, JSON.stringify({
        answers,
        probability: prob,
        completedAt: new Date().toISOString(),
      }))

      // Announce result
      setShowResult(true)
      const resultText = `Your joining probability is ${prob.toFixed(1)} percent.`
      setIsSpeaking(true)
      await speak(resultText)
      setIsSpeaking(false)
      return
    }

    setCurrentQuestion(index)
    setTranscript('')
    const question = QUESTIONS[index]
    
    setIsSpeaking(true)
    await speak(question)
    setIsSpeaking(false)
    
    // Auto-start listening after question
    setTimeout(() => {
      startListening()
    }, 500)
  }

  const startListening = async () => {
    setIsListening(true)
    setTranscript('')
    setError(null)

    try {
      const text = await listen()
      setTranscript(text)
      setIsListening(false)
      
      if (text.trim()) {
        setAnswers([...answers, text])
        
        // Brief confirmation before next question
        setTimeout(() => {
          askQuestion(currentQuestion + 1)
        }, 1000)
      }
    } catch (err) {
      setError(err.message)
      setIsListening(false)
    }
  }

  const handleConfirmAnswer = async () => {
    if (transcript.trim()) {
      setAnswers([...answers, transcript])
      setTranscript('')
      
      // Wait a moment, then ask next question
      setTimeout(() => {
        askQuestion(currentQuestion + 1)
      }, 500)
    }
  }

  const handleRetry = () => {
    if (window.confirm('This will clear your progress. Continue?')) {
      localStorage.removeItem(`assessment-${token}`)
      setAnswers([])
      setProbability(null)
      setShowResult(false)
      setCurrentQuestion(0)
      setTranscript('')
      askQuestion(0)
    }
  }

  if (error && error.includes('Invalid access token')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Token</h2>
          <p className="text-blue-200 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    const getRiskColor = () => {
      if (probability >= 70) return { color: 'from-green-400 to-emerald-500', text: 'High (Likely to Join)', icon: '✓' }
      if (probability >= 40) return { color: 'from-yellow-400 to-orange-500', text: 'Medium (Follow Up)', icon: '?' }
      return { color: 'from-red-400 to-pink-500', text: 'Low (Intervention Needed)', icon: '!' }
    }

    const risk = getRiskColor()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${risk.color} mb-6`}>
              <span className="text-4xl font-bold text-white">{risk.icon}</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
            <p className="text-blue-200 mb-6">Thank you, {candidateName}</p>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-sm text-blue-200 mb-2">Your Joining Probability</div>
              <div className="text-5xl font-bold text-white mb-2">{probability.toFixed(1)}%</div>
              <div className={`text-sm font-semibold px-3 py-2 rounded-full bg-gradient-to-r ${risk.color} text-white inline-block`}>
                {risk.text}
              </div>
            </div>

            <div className="text-sm text-blue-300 mb-6 space-y-2">
              <p>Your responses have been recorded and sent to the hiring team.</p>
              <p>You will receive an email with next steps soon.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-blue-950 border-b border-blue-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HireIQ Assessment</h1>
                <p className="text-blue-200 text-sm">Voice-based Interview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-88px)]">
        {/* Candidate Info */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">{candidateName}</h2>
          <p className="text-blue-300">{position}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-semibold">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span className="text-blue-300 text-sm">{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-900/50 border border-blue-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8 flex flex-col">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-blue-200 text-sm font-medium mb-2">Question {currentQuestion + 1}</p>
              <h3 className="text-2xl font-bold text-white leading-tight">{QUESTIONS[currentQuestion]}</h3>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {transcript && (
              <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6">
                <p className="text-blue-200 text-sm font-medium mb-2">Your Answer:</p>
                <p className="text-white text-lg">{transcript}</p>
              </div>
            )}

            {isListening && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-medium">Listening...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isListening && !isSpeaking && !transcript && (
              <button
                onClick={startListening}
                className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-4 rounded-lg transition-all"
              >
                <Mic className="w-5 h-5" />
                Start Listening
              </button>
            )}

            {isListening && (
              <button
                onClick={stopListening}
                className="flex items-center justify-center gap-2 flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-all"
              >
                <Loader className="w-5 h-5 animate-spin" />
                Stop Recording
              </button>
            )}

            {transcript && !isListening && (
              <>
                <button
                  onClick={handleConfirmAnswer}
                  className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white font-semibold py-4 rounded-lg transition-all"
                >
                  <Check className="w-5 h-5" />
                  Confirm & Next
                </button>
                <button
                  onClick={() => {
                    setTranscript('')
                    startListening()
                  }}
                  className="flex items-center justify-center gap-2 flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 rounded-lg transition-all"
                >
                  <Mic className="w-5 h-5" />
                  Retry
                </button>
              </>
            )}

            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 flex-1 bg-white/10 border border-white/30 text-white font-semibold py-4 rounded-lg">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>Bot Speaking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-300 text-sm">
          <p>Powered by HireIQ — AI-Powered Voice Assessment</p>
        </div>
      </main>
    </div>
  )
}
