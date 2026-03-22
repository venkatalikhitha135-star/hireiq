import { useNavigate } from 'react-router-dom'
import { LogOut, Users, TrendingUp, Clock, UserCheck } from 'lucide-react'

export default function HRDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  const recentActivity = [
    { user: 'John Smith', action: 'Accepted offer', time: '2 hours ago', status: 'accepted' },
    { user: 'Sarah Johnson', action: 'Viewed offer', time: '4 hours ago', status: 'viewed' },
    { user: 'Mike Davis', action: 'Declined offer', time: '6 hours ago', status: 'declined' },
    { user: 'Emily Wilson', action: 'Pending response', time: '8 hours ago', status: 'pending' },
  ]

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              HR Dashboard
            </h1>
            <p className="text-neutral-600 text-sm">
              Manage offers and employee engagement
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
              <p className="text-neutral-600 text-xs font-medium">Total Employees</p>
            </div>
            <p className="font-display text-2xl font-bold text-neutral-900">284</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
              <p className="text-neutral-600 text-xs font-medium">Active Offers</p>
            </div>
            <p className="font-display text-2xl font-bold text-neutral-900">42</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
              <p className="text-neutral-600 text-xs font-medium">Pending</p>
            </div>
            <p className="font-display text-2xl font-bold text-yellow-600">18</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
              <p className="text-neutral-600 text-xs font-medium">Accepted</p>
            </div>
            <p className="font-display text-2xl font-bold text-green-600">28</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200">
          <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => {
              let statusColor = 'bg-gray-100 text-gray-600'
              if (activity.status === 'accepted') statusColor = 'bg-green-100 text-green-700'
              if (activity.status === 'declined') statusColor = 'bg-red-100 text-red-700'
              if (activity.status === 'pending') statusColor = 'bg-yellow-100 text-yellow-700'
              if (activity.status === 'viewed') statusColor = 'bg-blue-100 text-blue-700'

              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">{activity.user}</p>
                    <p className="text-sm text-neutral-600">{activity.action}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                    <span className="text-xs text-neutral-500">{activity.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
