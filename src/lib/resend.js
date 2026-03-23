// Email template for assessment invitations
export const generateAssessmentEmailTemplate = (candidateName, assessmentLink, jobTitle) => {
  return `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e3a5f; margin: 0; font-size: 24px;">HireIQ Voice Assessment</h1>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #111827; margin: 0 0 10px 0;">Dear ${candidateName},</p>
        <p style="color: #4b5563; margin: 10px 0;">
          Thank you for your interest in the <strong>${jobTitle}</strong> position. We'd like to learn more about you through a voice assessment.
        </p>
        <p style="color: #4b5563; margin: 10px 0;">
          This brief assessment will help us understand your communication skills and professional background better.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${assessmentLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: background-color 150ms;">
          Start Assessment
        </a>
      </div>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          <strong>Note:</strong> You'll need to allow microphone access to complete the assessment. The process typically takes 5-10 minutes.
        </p>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        Best regards,<br>
        The HireIQ Team
      </p>
    </div>
  `
}

// Send assessment email via the backend
export const sendAssessmentEmail = async (email, candidateName, assessmentLink, jobTitle) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Assessment Invitation - ${jobTitle} Position`,
        html: generateAssessmentEmailTemplate(candidateName, assessmentLink, jobTitle),
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Generate summary email after assessment
export const generateSummaryEmailTemplate = (candidateName, assessmentResults) => {
  return `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e3a5f; margin: 0; font-size: 24px;">Assessment Complete</h1>
      </div>

      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
        <p style="color: #111827; margin: 0;">Thank you for completing the assessment, ${candidateName}!</p>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e3a5f; margin-top: 0;">Assessment Summary</h3>
        <ul style="color: #4b5563; margin: 10px 0; padding-left: 20px;">
          <li>Total Duration: ${assessmentResults.duration || 'N/A'}</li>
          <li>Questions Answered: ${assessmentResults.questionsAnswered || 0}</li>
          <li>Status: Completed</li>
        </ul>
      </div>

      <p style="color: #6b7280; margin: 20px 0;">
        Your assessment has been received and will be reviewed by our hiring team. We'll be in touch soon with next steps.
      </p>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        Best regards,<br>
        The HireIQ Team
      </p>
    </div>
  `
}
