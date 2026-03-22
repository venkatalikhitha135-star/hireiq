import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase } from 'lucide-react'

export default function RoleSelection() {
  const navigate = useNavigate()
  const [hoveredRole, setHoveredRole] = useState(null)

  const roles = [
    {
      id: 'hr',
      title: 'HR',
      description: 'Human Resources',
      icon: Briefcase,
      path: '/hr-login',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'Team Member',
      icon: Users,
      path: '/employee-login',
      color: 'from-blue-500 to-blue-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Offer Engagement
          </h1>
          <p className="text-xl text-slate-600 font-light">
            Select your role to get started
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon
            const isHovered = hoveredRole === role.id

            return (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative h-64 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-2 border border-slate-100"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {/* Icon */}
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${role.color} shadow-lg transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    <IconComponent className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 transition-colors duration-300">
                    {role.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-500 text-sm font-medium transition-colors duration-300 group-hover:text-slate-700">
                    {role.description}
                  </p>

                  {/* Arrow */}
                  <div className={`mt-6 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Secure authentication powered by Offer Engagement Portal
          </p>
        </div>
      </div>
    </div>
  )
}
