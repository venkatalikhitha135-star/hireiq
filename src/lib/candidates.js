// Generate a unique assessment token
export const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Parse Excel-like CSV data
export const parseCandidateCSV = (csvText) => {
  const lines = csvText.split('\n').filter((line) => line.trim())
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())

  const candidates = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const candidate = {}
    headers.forEach((header, index) => {
      candidate[header] = values[index] || ''
    })
    return {
      ...candidate,
      id: generateToken(),
      token: generateToken(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  })

  return candidates
}

// Generate assessment link
export const generateAssessmentLink = (token) => {
  const baseURL = window.location.origin
  return `${baseURL}/assess/${token}`
}

// Store candidates in localStorage (temporary solution)
export const saveCandidates = (candidates) => {
  localStorage.setItem('candidates', JSON.stringify(candidates))
}

// Retrieve candidates from localStorage
export const getCandidates = () => {
  const stored = localStorage.getItem('candidates')
  return stored ? JSON.parse(stored) : []
}

// Update candidate assessment
export const updateCandidateAssessment = (token, assessmentData) => {
  const candidates = getCandidates()
  const updated = candidates.map((c) =>
    c.token === token
      ? {
          ...c,
          ...assessmentData,
          status: 'completed',
          completedAt: new Date().toISOString(),
        }
      : c,
  )
  saveCandidates(updated)
  return updated.find((c) => c.token === token)
}

// Get candidate by token
export const getCandidateByToken = (token) => {
  const candidates = getCandidates()
  return candidates.find((c) => c.token === token)
}

// Delete candidate
export const deleteCandidate = (id) => {
  const candidates = getCandidates()
  const filtered = candidates.filter((c) => c.id !== id)
  saveCandidates(filtered)
}
