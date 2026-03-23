import * as XLSX from 'xlsx'

/**
 * Parse Excel or CSV file and extract candidate data
 */
export async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(worksheet)

        // Map common column name variations
        const candidates = rows.map(row => {
          const keys = Object.keys(row)
          const findColumn = (patterns) => {
            const key = keys.find(k =>
              patterns.some(p => k.toLowerCase().includes(p.toLowerCase()))
            )
            return key ? row[key] : ''
          }

          return {
            name: findColumn(['name', 'candidate', 'first name']) || '',
            email: findColumn(['email', 'e-mail', 'mail']) || '',
            phone: findColumn(['phone', 'mobile', 'contact']) || '',
            position: findColumn(['position', 'role', 'job', 'title', 'designation']) || '',
            department: findColumn(['department', 'dept', 'team']) || '',
            token: '',
            status: 'invited',
            joinProbability: null,
            answers: null,
            completedAt: null,
          }
        })

        // Filter out empty rows
        const filtered = candidates.filter(c => c.name && c.email)

        if (filtered.length === 0) {
          reject(new Error('No valid candidate data found in the file'))
        } else {
          resolve(filtered)
        }
      } catch (error) {
        reject(new Error('Failed to parse file: ' + error.message))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Generate a unique token for each candidate
 */
export function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 28; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Calculate joining probability based on answers
 * Analyzes sentiment and weighted scoring of responses
 */
export function calculateProbability(answers) {
  if (!answers || answers.length === 0) return 0

  const positiveKeywords = [
    'yes',
    'definitely',
    'absolutely',
    'sure',
    'interested',
    'excited',
    'great',
    'good',
    'amazing',
    'perfect',
    'absolutely yes',
    'sounds good',
    'looks good',
    'really want',
    'keen',
    'very interested',
    'no concerns',
    'no issues',
    'no problem',
    'immediately',
    'right away',
    'soon',
    'as soon as',
    'asap',
    'straight away',
    'no',
    "won't be",
    'not',
    'nowhere',
  ]

  const negativeKeywords = [
    'no',
    'nope',
    'not interested',
    'not sure',
    'maybe',
    'unsure',
    'confused',
    'concerns',
    'worried',
    'issues',
    'problems',
    'difficult',
    'challenging',
    'complicated',
    "don't know",
    'uncertain',
    'hesitant',
    'doubt',
    'unlikely',
    'probably not',
    'not really',
    'not much',
    'far away',
    'relocation issue',
    'relocation problem',
    'can\'t relocate',
    'other offer',
    'other job',
    'multiple offers',
    'better offer',
    'higher salary',
    'more money',
    'not enough',
    'below expectations',
    'disappointed',
  ]

  // Weights for each question
  const weights = [0.25, 0.2, 0.2, 0.15, 0.1, 0.1]

  // Special logic for inverted questions (Q2, Q4 - having other offers is negative)
  const invertedQuestions = [1, 3] // Q2 (index 1) and Q4 (index 3)

  let totalScore = 0

  answers.forEach((answer, idx) => {
    if (!answer) return

    const answerLower = answer.toLowerCase()
    let score = 50 // Neutral baseline

    // Count positive and negative keywords
    let positiveCount = 0
    let negativeCount = 0

    positiveKeywords.forEach(keyword => {
      if (answerLower.includes(keyword)) positiveCount++
    })

    negativeKeywords.forEach(keyword => {
      if (answerLower.includes(keyword)) negativeCount++
    })

    // Calculate sentiment score
    if (positiveCount > negativeCount) {
      score = 70 + Math.min(positiveCount - negativeCount, 3) * 10
    } else if (negativeCount > positiveCount) {
      score = 30 - Math.min(negativeCount - positiveCount, 3) * 10
    }

    // Invert score for Q2 and Q4 (having other offers = negative signal)
    if (invertedQuestions.includes(idx)) {
      score = 100 - score
    }

    // Add weighted score
    totalScore += (score / 100) * weights[idx]
  })

  // Ensure probability is between 5 and 98
  let probability = Math.round(totalScore * 100 * 10) / 10
  probability = Math.max(5, Math.min(98, probability))

  return probability
}

/**
 * Determine risk level based on probability
 */
export function getRiskLevel(probability) {
  if (probability >= 70) return { level: 'High', color: 'green' }
  if (probability >= 40) return { level: 'Medium', color: 'yellow' }
  return { level: 'Low', color: 'red' }
}
