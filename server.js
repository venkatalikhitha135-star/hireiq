// server.js
// Local development server — runs on port 3001
// Vite proxies /api → this server
// Run: node server.js   (in a separate terminal)

import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'to, subject, and html are required' })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY

  // Demo mode for testing without API key
  if (!apiKey) {
    console.log(`
📨 [DEMO MODE]
To      : ${to}
Subject : ${subject}
    `)
    return res.json({
      id: 'demo_' + Date.now(),
      message: 'Demo mode — email simulated',
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
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [to.trim()],
        subject,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('❌ RESEND ERROR:', data)
      return res.status(response.status).json(data)
    }

    console.log('✅ Email sent to:', to)
    return res.json({ id: data.id, message: 'Sent!' })
  } catch (err) {
    console.log('SERVER ERROR:', err.message)
    return res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('📧 API server running at http://localhost:3001'))
