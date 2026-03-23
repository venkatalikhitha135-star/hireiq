import React, { useState } from 'react'
import { Upload, Send, Download, Trash2, Eye, Loader } from 'lucide-react'
import { parseExcel, generateToken, calculateProbability } from '../lib/candidates'
import { sendInvites } from '../lib/resend'

export default function Dashboard() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const data = await parseExcel(file)
      const withTokens = data.map(row => ({
        ...row,
        token: generateToken(),
        status: 'invited',
        joinProbability: null,
        answers: null,
        completedAt: null,
      }))
      setCandidates(withTokens)
      setShowResults(false)
    } catch (error) {
      alert('Error parsing file: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvites = async () => {
    if (candidates.length === 0) {
      alert('Please upload candidates first')
      return
    }

    setSending(true)
    try {
      await sendInvites(candidates)
      alert(`Invites sent to ${candidates.length} candidates!`)
    } catch (error) {
      alert('Error sending invites: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  const handleExportResults = () => {
    if (candidates.length === 0) {
      alert('No candidates to export')
      return
    }

    const headers = [
      'Name',
      'Email',
      'Position',
      'Join Probability (%)',
      'Risk Level',
      'Completed At',
      'Q1 Answer',
      'Q2 Answer',
      'Q3 Answer',
      'Q4 Answer',
      'Q5 Answer',
      'Q6 Answer',
    ]

    const rows = candidates.map(c => [
      c.name || '',
      c.email || '',
      c.position || '',
      c.joinProbability !== null ? c.joinProbability.toFixed(1) : 'N/A',
      c.joinProbability !== null
        ? c.joinProbability >= 70
          ? 'High'
          : c.joinProbability >= 40
            ? 'Medium'
            : 'Low'
        : 'N/A',
      c.completedAt || '',
      c.answers?.[0] || '',
      c.answers?.[1] || '',
      c.answers?.[2] || '',
      c.answers?.[3] || '',
      c.answers?.[4] || '',
      c.answers?.[5] || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(cell => {
            const cellStr = String(cell).replace(/"/g, '""')
            return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
              ? `"${cellStr}"`
              : cellStr
          })
          .join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hireiq-results-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all candidates?')) {
      setCandidates([])
      setShowResults(false)
    }
  }

  const riskLevel = (prob) => {
    if (prob >= 70) return { level: 'High', color: 'bg-green-100 text-green-800' }
    if (prob >= 40) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' }
    return { level: 'Low', color: 'bg-red-100 text-red-800' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-blue-950 border-b border-blue-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HireIQ</h1>
                <p className="text-blue-200 text-sm">Voice Assessment Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {candidates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
              <div className="text-sm font-medium text-blue-200 mb-2">Total Candidates</div>
              <div className="text-3xl font-bold">{candidates.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
              <div className="text-sm font-medium text-blue-200 mb-2">Completed</div>
              <div className="text-3xl font-bold">{candidates.filter(c => c.completedAt).length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
              <div className="text-sm font-medium text-blue-200 mb-2">High Risk</div>
              <div className="text-3xl font-bold text-green-400">
                {candidates.filter(c => c.joinProbability && c.joinProbability >= 70).length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
              <div className="text-sm font-medium text-blue-200 mb-2">Low Risk</div>
              <div className="text-3xl font-bold text-red-400">
                {candidates.filter(c => c.joinProbability && c.joinProbability < 40).length}
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Upload Candidates</h2>
          </div>

          <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-white font-medium">Drag and drop your file</p>
              <p className="text-blue-200 text-sm">or click to select (Excel/CSV)</p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
            />
          </label>

          {loading && (
            <div className="mt-4 flex items-center gap-2 text-blue-200">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Parsing file...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {candidates.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleSendInvites}
              disabled={sending}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Invites
                </>
              )}
            </button>

            <button
              onClick={() => setShowResults(!showResults)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <Eye className="w-5 h-5" />
              {showResults ? 'Hide' : 'View'} Results
            </button>

            <button
              onClick={handleExportResults}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Export Results
            </button>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 font-semibold py-3 px-6 rounded-lg transition-all ml-auto"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          </div>
        )}

        {/* Results Table */}
        {showResults && candidates.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Position</th>
                    <th className="px-6 py-3 text-center font-semibold">Probability</th>
                    <th className="px-6 py-3 text-center font-semibold">Risk Level</th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {candidates.map((candidate, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{candidate.name}</td>
                      <td className="px-6 py-4 text-blue-200">{candidate.email}</td>
                      <td className="px-6 py-4">{candidate.position}</td>
                      <td className="px-6 py-4 text-center">
                        {candidate.joinProbability !== null ? `${candidate.joinProbability.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {candidate.joinProbability !== null ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${riskLevel(candidate.joinProbability).color}`}
                          >
                            {riskLevel(candidate.joinProbability).level}
                          </span>
                        ) : (
                          <span className="text-blue-300">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            candidate.completedAt
                              ? 'bg-green-500/20 text-green-200'
                              : 'bg-blue-500/20 text-blue-200'
                          }`}
                        >
                          {candidate.completedAt ? 'Completed' : 'Invited'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {candidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Candidates Yet</h3>
            <p className="text-blue-200">Upload an Excel or CSV file to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}
