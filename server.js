// server.js
// Local development server — runs on port 3001
// Vite proxies /api → this server
// Run: node server.js   (in a separate terminal)

import express from 'express'
import cors from 'cors'
import { buildEmailHtml } from './src/lib/resend.js'
import * as dotenv from 'dotenv'

dotenv.config()
console.log("KEY:", process.env.RESEND_API_KEY);

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/send-invite', async (req, res) => {
  const { toName, toEmail, position, voiceBotLink, fromName } = req.body

  if (!toEmail || !voiceBotLink) {
    return res.status(400).json({ error: 'toEmail and voiceBotLink are required' })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY

  const ALLOWED_TEST_EMAIL = "venkatalikhitha135@gmail.com"

if (!apiKey || toEmail !== ALLOWED_TEST_EMAIL) {
  console.log(`
📨 [DEMO MODE]
To      : ${toEmail}
Name    : ${toName}
Position: ${position}
Link    : ${voiceBotLink}
  `)

  return res.json({
    id: 'demo_' + Date.now(),
    message: 'Demo mode — email simulated'
  })
}

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${process.env.FROM_NAME || 'HireIQ HR'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: [toEmail.trim()],
        subject: `${toName}, your voice assessment is ready — ${position || 'offer follow-up'}`,
        html: buildEmailHtml({ toName, position, voiceBotLink, fromName }),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("❌ RESEND ERROR:", data)   // 👈 shows real reason
      return res.status(response.status).json(data)
    }

    console.log("✅ Email sent to:", toEmail)
    return res.json({ id: data.id, message: 'Sent!' })

  } catch (err) {
    console.log("SERVER ERROR:", err.message)
    return res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () =>
  console.log('📧 API server running at http://localhost:3001')
)