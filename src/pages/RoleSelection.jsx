import { useNavigate } from 'react-router-dom'
import { Users, Briefcase } from 'lucide-react'

export default function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Offer Engagement Portal
          </h1>
          <p className="text-neutral-600 text-lg">
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* HR Card */}
          <button
            onClick={() => navigate('/hr-login')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-neutral-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                HR
              </h2>
              <p className="text-neutral-600 text-sm mb-6">
                Manage offers and employee engagement
              </p>
              <div className="inline-block px-6 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium group-hover:bg-primary-100 transition-colors">
                Sign In
              </div>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={() => navigate('/employee-login')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-neutral-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                Employee
              </h2>
              <p className="text-neutral-600 text-sm mb-6">
                View and respond to offers
              </p>
              <div className="inline-block px-6 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium group-hover:bg-primary-100 transition-colors">
                Sign In
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-neutral-500 text-sm">
          <p>Secure login • No shared credentials • Role-based access</p>
        </div>
      </div>
    </div>
  )
}
