import { useNavigate } from 'react-router-dom'
import { LogOut, Gift, Clock, CheckCircle } from 'lucide-react'

export default function EmployeeDashboard() {
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
            <h1 className="text-3xl font-bold text-slate-900">My Offers</h1>
            <p className="text-slate-600 text-sm mt-1">View and manage your engagement offers</p>
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
        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Gift, label: 'Available Offers', value: '3', color: 'from-blue-500 to-blue-600' },
            { icon: Clock, label: 'Pending Response', value: '1', color: 'from-yellow-500 to-yellow-600' },
            { icon: CheckCircle, label: 'Completed', value: '2', color: 'from-green-500 to-green-600' },
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

        {/* Offers */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Senior Developer Position', department: 'Engineering', status: 'pending', salary: '$95K - $120K' },
            { title: 'Project Manager Role', department: 'Product', status: 'pending', salary: '$85K - $105K' },
            { title: 'Marketing Specialist', department: 'Marketing', status: 'completed', salary: '$65K - $80K' },
          ].map((offer, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{offer.title}</h3>
                  <p className="text-sm text-slate-600">{offer.department}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  offer.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {offer.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-4">{offer.salary}</p>
              <button className="w-full py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
