import { useCallback, useRef } from 'react'

export function useSpeech() {
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)

  // Initialize Web Speech API
  const getSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported in this browser. Please use Chrome or Edge.')
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognitionRef.current = recognition
    return recognition
  }, [])

  const speak = useCallback(async (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis

      // Cancel any ongoing speech
      synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => {
        resolve()
      }
      utterance.onerror = () => {
        resolve()
      }

      synth.speak(utterance)
    })
  }, [])

  const listen = useCallback(
    () =>
      new Promise((resolve, reject) => {
        try {
          const recognition = getSpeechRecognition()

          let transcript = ''

          recognition.onstart = () => {
            transcript = ''
          }

          recognition.onresult = (event) => {
            transcript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptSegment = event.results[i][0].transcript
              transcript += transcriptSegment
            }
          }

          recognition.onend = () => {
            if (transcript.trim()) {
              resolve(transcript)
            } else {
              reject(new Error('No speech detected. Please try again.'))
            }
          }

          recognition.onerror = (event) => {
            const errorMessages = {
              'no-speech': 'No speech was detected. Please try again.',
              'audio-capture': 'No microphone was found. Ensure that it is connected.',
              'network': 'Network error occurred. Please check your connection.',
            }
            reject(new Error(errorMessages[event.error] || `Error: ${event.error}`))
          }

          recognition.start()
        } catch (error) {
          reject(error)
        }
      }),
    [getSpeechRecognition],
  )

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  return { speak, listen, stopListening }
}
