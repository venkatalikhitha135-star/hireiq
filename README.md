# HireIQ — Voice Assessment Platform

A standalone React app that:
1. **HR uploads Excel/CSV** → unique voice bot links auto-generated per candidate
2. **Clicks "Send Invites"** → Resend emails each candidate their personal link
3. **Candidate opens link** → AI voice bot asks 6 questions via speaker, listens via mic
4. **Responses analyzed** → Joining probability calculated, saved back to dashboard

---

## 📁 Project Structure

```
hireiq/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx     ← HR dashboard (upload, send, results)
│   │   └── VoiceBot.jsx      ← Candidate voice bot page
│   ├── hooks/
│   │   └── useSpeech.js      ← Web Speech API hook (speak + listen)
│   ├── lib/
│   │   ├── candidates.js     ← Excel parse, token gen, probability calc
│   │   └── resend.js         ← Email sender + HTML template
│   ├── main.jsx              ← React Router entry
│   └── index.css             ← Global styles + animations
├── api/
│   └── send-invite.js        ← Vercel serverless function (Resend)
├── server.js                 ← Local dev Express server
├── vercel.json               ← Vercel routing config
├── vite.config.js
├── .env.example              ← Copy to .env and fill in
└── package.json
```

---

## 🚀 Quick Start (Local Dev)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env — at minimum add your Resend API key
```

### 3. Get a free Resend API key
1. Go to [resend.com](https://resend.com) → Create free account
2. Dashboard → API Keys → Create Key → copy it
3. Free tier: **100 emails/day, 3,000/month** — more than enough
4. Verify your sending domain OR use `onboarding@resend.dev` for testing

### 4. Run the app

**Terminal 1 — API server:**
```bash
node server.js
```

**Terminal 2 — React app:**
```bash
npm run dev
```

Open http://localhost:5173

---

## 📧 Email Flow

When you click "Send Invites":
- Dashboard calls `POST /api/send-invite` for each candidate
- Server calls Resend API with a beautiful HTML email
- Email contains candidate's unique link: `/voice-bot?token=...&name=...&pos=...`
- **Without Resend key**: runs in demo mode — logs links to console, no email sent

### Email template variables
The email includes:
- Candidate's name & position
- Big CTA button → voice bot link
- Step-by-step instructions
- Link expiry notice (7 days)

---

## 🎙️ Voice Bot Flow (Candidate Side)

1. Candidate clicks link in email → `/voice-bot?token=c1_AbCd...&name=Arjun&pos=Engineer`
2. Browser requests microphone permission
3. Bot speaks each question using `SpeechSynthesisUtterance` (text-to-speech)
4. Mic auto-activates after each question
5. Candidate speaks → `SpeechRecognition` captures transcript in real-time
6. Candidate confirms answer → bot speaks next question
7. After Q6 → probability calculated → result shown + spoken aloud
8. Result saved to `localStorage` → dashboard picks it up via polling

### 6 Assessment Questions
| # | Question | Weight |
|---|----------|--------|
| 1 | Still interested in joining? | 25% |
| 2 | Received other offers? | 20% |
| 3 | Compensation meeting expectations? | 20% |
| 4 | Any concerns about role/team? | 15% |
| 5 | Expected joining date? | 10% |
| 6 | Location/relocation challenge? | 10% |

### Probability Algorithm
- Each answer analyzed for positive/negative sentiment keywords
- Q2 and Q4 have inverted logic (having other offers = negative)
- Weighted average → final probability (5%–98%)
- **≥70%** = High (likely to join) 🟢
- **40–69%** = Medium (follow up needed) 🟡
- **<40%** = Low (intervention needed) 🔴

---

## 📊 Export Results

After assessments complete, click **Export Results** to download an Excel file with:
- All candidate details
- Voice bot links
- Email status
- Join probability %
- Risk level classification
- Individual answers for all 6 questions
- Completion timestamp

---

## 🌐 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# RESEND_API_KEY = re_your_key_here
# (VITE_ variables are build-time; RESEND_API_KEY is server-side only)
```

The `api/send-invite.js` becomes a Vercel serverless function automatically.
The `vercel.json` handles SPA routing.

After deploying, update `VITE_BASE_URL` in your Vercel environment variables to your production URL.

---

## 🌐 Browser Compatibility

Voice bot requires:
- **Google Chrome** ✅ (recommended)
- **Microsoft Edge** ✅
- **Safari** ⚠️ (TTS works, STT limited)
- **Firefox** ❌ (no SpeechRecognition support)

The dashboard works in all modern browsers.

---

## 📋 Sample CSV Format

```csv
Name,Email,Phone,Position,Department
Arjun Mehta,arjun.mehta@example.com,+91-98765-43210,Senior Engineer,Engineering
Priya Sharma,priya.sharma@example.com,+91-87654-32109,Product Manager,Product
```

Column names are flexible — the parser recognises common variations.

---

## 🔒 Security Notes

- Each token is 28 random alphanumeric characters — practically unguessable
- Resend API key is **never** in the browser bundle — server-side only
- Results stored in `localStorage` keyed by token (candidate-isolated)
- For production: add token validation + database storage (Supabase/PlanetScale)
