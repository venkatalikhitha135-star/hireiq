import { useNavigate } from 'react-router-dom'
import { LogOut, Users, BarChart3, Calendar } from 'lucide-react'

export default function HRDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">HR Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Welcome back, HR Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors duration-200 border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Employees', value: '284', color: 'from-indigo-500 to-indigo-600' },
            { icon: BarChart3, label: 'Active Offers', value: '42', color: 'from-blue-500 to-blue-600' },
            { icon: Calendar, label: 'Pending Reviews', value: '18', color: 'from-purple-500 to-purple-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: 'John Smith', action: 'Viewed offer', time: '2 hours ago' },
              { user: 'Sarah Johnson', action: 'Accepted offer', time: '4 hours ago' },
              { user: 'Mike Davis', action: 'Declined offer', time: '6 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">{activity.user}</p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
