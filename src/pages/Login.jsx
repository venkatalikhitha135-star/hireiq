import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css'

const VALID_EMAIL = 'likhitha1112@outlook.com'
const VALID_PASSWORD = '12345678'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [loginType, setLoginType] = useState('hr') // 'hr' or 'employee'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      login(email, loginType)
      navigate('/')
    } else {
      setError('Invalid email or password')
    }

    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo/Brand */}
        <div className="login-header">
          <h1 className="login-title">HireIQ</h1>
          <p className="login-subtitle">Voice Assessment Platform</p>
        </div>

        {/* Login Type Selector */}
        <div className="login-type-selector">
          <button
            className={`login-type-btn ${loginType === 'hr' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('hr')
              setError('')
            }}
          >
            <span className="login-type-icon">👔</span>
            <span>HR Login</span>
          </button>
          <button
            className={`login-type-btn ${loginType === 'employee' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('employee')
              setError('')
            }}
          >
            <span className="login-type-icon">👤</span>
            <span>Employee Login</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : `Login as ${loginType === 'hr' ? 'HR' : 'Employee'}`}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <p className="demo-label">Demo Credentials</p>
          <div className="credentials-box">
            <p><strong>Email:</strong> {VALID_EMAIL}</p>
            <p><strong>Password:</strong> {VALID_PASSWORD}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
