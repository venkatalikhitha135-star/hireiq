import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, role) => {
    setUser({
      email,
      role, // 'hr' or 'employee'
      loginTime: new Date(),
    })
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
