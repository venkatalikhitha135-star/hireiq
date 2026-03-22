import { useNavigate } from 'react-router-dom'
import { LogOut, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function EmployeeDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  const offers = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      status: 'pending',
      daysLeft: 3,
      salary: '$150,000 - $180,000'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      status: 'accepted',
      daysLeft: null,
      salary: '$120,000 - $150,000'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Creative Studios',
      status: 'declined',
      daysLeft: null,
      salary: '$100,000 - $130,000'
    },
    {
      id: 4,
      title: 'Data Analyst',
      company: 'Analytics Pro',
      status: 'pending',
      daysLeft: 5,
      salary: '$90,000 - $120,000'
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </div>
        )
      case 'accepted':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Accepted
          </div>
        )
      case 'declined':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Declined
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              My Offers
            </h1>
            <p className="text-neutral-600 text-sm">
              Review and respond to your offers
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
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-neutral-600 text-xs font-medium mb-1">Total Offers</p>
            <p className="font-display text-2xl font-bold text-neutral-900">4</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-neutral-600 text-xs font-medium mb-1">Pending</p>
            <p className="font-display text-2xl font-bold text-yellow-600">2</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-neutral-600 text-xs font-medium mb-1">Accepted</p>
            <p className="font-display text-2xl font-bold text-green-600">1</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-neutral-600 text-xs font-medium mb-1">Declined</p>
            <p className="font-display text-2xl font-bold text-red-600">1</p>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-neutral-900 mb-1">
                        {offer.title}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-2">
                        {offer.company}
                      </p>
                      <p className="text-primary-600 font-medium text-sm">
                        {offer.salary}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:flex-col md:items-end">
                  {getStatusBadge(offer.status)}
                  {offer.daysLeft && (
                    <p className="text-neutral-600 text-xs font-medium">
                      {offer.daysLeft} days left
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
