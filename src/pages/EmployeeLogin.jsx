import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function EmployeeLogin() {
  const navigate = useNavigate()
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Demo credentials
  const DEMO_ID = 'EMP001'
  const DEMO_PASSWORD = 'Demo@123'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!employeeId.trim()) {
      setError('Employee ID or Email is required')
      return
    }
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    // Simulate login
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check credentials
    if (employeeId === DEMO_ID && password === DEMO_PASSWORD) {
      setSuccess(true)
      setEmployeeId('')
      setPassword('')
      // Redirect after success message
      setTimeout(() => {
        navigate('/employee-dashboard')
      }, 1500)
    } else {
      setError('Invalid Employee ID/Email or password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors duration-200 border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Employee Login</h1>
            <p className="text-slate-600 text-sm font-light">
              Sign in to access your dashboard and offers
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-gap-3 animate-in slide-in-from-top">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="ml-2">
                <p className="text-green-900 font-medium text-sm">Welcome back!</p>
                <p className="text-green-700 text-xs">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-gap-3 animate-in slide-in-from-top">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="ml-2">
                <p className="text-red-900 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee ID Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Employee ID or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={loading}
                  placeholder="EMP001 or your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 1019.542 10c0 .206-.014.412-.042.617l1.528 1.528a1 1 0 001.414-1.414L3.707 2.293zM12.96 6.75a2 2 0 10-2.828 2.828A2 2 0 0012.96 6.75z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                <span>Employee ID:</span>
                <code className="font-mono font-semibold text-slate-900">{DEMO_ID}</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                <span>Password:</span>
                <code className="font-mono font-semibold text-slate-900">{DEMO_PASSWORD}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Employee Portal • Secure Authentication
        </p>
      </div>
    </div>
  )
}
