import { useState, useRef, useCallback } from 'react'

const useSpeech = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser')
      return false
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.language = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcript + ' ')
        } else {
          interimTranscript += transcript
        }
      }
    }

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    return true
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      initializeRecognition()
    }
    recognitionRef.current?.start()
  }, [initializeRecognition])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        setError(`Speech synthesis error: ${event.error}`)
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      setError('Text-to-Speech not supported in this browser')
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
    } catch (err) {
      setError('Could not access microphone: ' + err.message)
    }
  }, [])

  const stopRecording = useCallback(
    () =>
      new Promise((resolve) => {
        if (!mediaRecorderRef.current) {
          resolve(null)
          return
        }

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          chunksRef.current = []
          resolve(blob)
        }
        mediaRecorderRef.current.stop()
      }),
    [],
  )

  return {
    isListening,
    transcript,
    error,
    isSpeaking,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    startRecording,
    stopRecording,
  }
}

export default useSpeech
