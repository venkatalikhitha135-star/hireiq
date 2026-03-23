const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173'

/**
 * Generate HTML email template
 */
function generateEmailHTML(candidateName, position, voiceBotLink) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { background-color: white; padding: 30px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1e3a8a; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: 600; color: #0369a1; text-transform: uppercase; margin-bottom: 10px; }
          .section-text { font-size: 14px; color: #666; line-height: 1.6; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0369a1 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .cta-button:hover { opacity: 0.9; }
          .steps { background-color: #f0f9ff; border-left: 4px solid #0369a1; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .step { margin-bottom: 10px; font-size: 14px; }
          .step strong { color: #1e3a8a; }
          .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .footer p { margin: 5px 0; }
          .highlight { background-color: #fef3c7; padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HireIQ</h1>
            <p>Voice Assessment Platform</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hi ${candidateName},</div>
            
            <div class="section">
              <div class="section-text">
                Thank you for your interest in the <strong>${position}</strong> position! We're excited to move forward with your application.
              </div>
            </div>

            <div class="section">
              <div class="section-title">Your Voice Assessment</div>
              <div class="section-text">
                As part of our hiring process, we'd like you to complete a voice-based assessment. This is a quick, conversational interview that helps us get to know you better.
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${voiceBotLink}" class="cta-button">Start Voice Assessment</a>
            </div>

            <div class="highlight">
              ⏱️ <strong>Takes about 5-10 minutes</strong> — No preparation needed, just speak naturally!
            </div>

            <div class="section">
              <div class="section-title">How It Works</div>
              <div class="steps">
                <div class="step"><strong>1.</strong> Click the button above to start</div>
                <div class="step"><strong>2.</strong> Allow browser access to your microphone</div>
                <div class="step"><strong>3.</strong> Listen to each question and speak your answer</div>
                <div class="step"><strong>4.</strong> Confirm each answer and continue to the next</div>
                <div class="step"><strong>5.</strong> Get instant feedback on your joining probability</div>
              </div>
            </div>

            <div class="section">
              <div class="section-text">
                <strong>ℹ️ Important:</strong> This assessment works best on Google Chrome, Microsoft Edge, or Safari. You'll need a working microphone and internet connection.
              </div>
            </div>

            <div class="section">
              <div class="section-text">
                <strong>Link expires in 7 days</strong> — Complete the assessment before then to ensure your responses are recorded.
              </div>
            </div>

            <div class="section">
              <div class="section-text">
                If you have any technical issues, please reply to this email and our team will help you out.
              </div>
            </div>

            <div class="section">
              <div class="section-text">
                Looking forward to hearing from you!<br>
                <strong>The HireIQ Team</strong>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>© 2024 HireIQ — Voice Assessment Platform</p>
            <p>This is an automated email. Please do not reply with sensitive information.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send email invites to candidates via Resend API
 */
export async function sendInvites(candidates) {
  const failed = []

  for (const candidate of candidates) {
    try {
      const voiceBotLink = `${BASE_URL}/voice-bot?token=${candidate.token}&name=${encodeURIComponent(candidate.name)}&pos=${encodeURIComponent(candidate.position)}`

      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidate.email,
          candidateName: candidate.name,
          position: candidate.position,
          voiceBotLink,
          html: generateEmailHTML(candidate.name, candidate.position, voiceBotLink),
        }),
      })

      if (!response.ok) {
        failed.push(candidate.email)
      }
    } catch (error) {
      console.error(`Failed to send invite to ${candidate.email}:`, error)
      failed.push(candidate.email)
    }
  }

  if (failed.length > 0) {
    throw new Error(`Failed to send ${failed.length} invites: ${failed.join(', ')}`)
  }
}

/**
 * Log demo mode links (for testing without Resend API key)
 */
export function logDemoLinks(candidates) {
  console.log('📋 Demo Mode — Voice Bot Links:')
  console.log('=====================================')
  candidates.forEach(candidate => {
    const link = `${BASE_URL}/voice-bot?token=${candidate.token}&name=${encodeURIComponent(candidate.name)}&pos=${encodeURIComponent(candidate.position)}`
    console.log(`${candidate.name} (${candidate.email}):`)
    console.log(link)
    console.log('---')
  })
  console.log('=====================================')
}
