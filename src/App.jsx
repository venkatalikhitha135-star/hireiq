import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import HRLogin from './pages/HRLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import HRDashboard from './pages/HRDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/hr-login" element={<HRLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
    </Routes>
  )
}
