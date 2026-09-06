import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const fetchDashboardStats = async () => {
  // Mock data for now until API is ready
  return {
    total: 10,
    completed: 4,
    pending: 5,
    urgent: 1
  }
  // const { data } = await axios.get('/dashboard')
  // return data
}

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  })

  if (isLoading) return <div className="text-center mt-4">Loading stats...</div>
  if (isError) return <div className="text-center mt-4" style={{ color: 'var(--danger-color)' }}>Error loading stats</div>

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="form-label">Total Tasks</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{stats.total}</h2>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success-color)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="form-label">Completed</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{stats.completed}</h2>
            </div>
            <CheckCircle2 size={32} color="var(--success-color)" opacity={0.2} />
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="form-label">Pending</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{stats.pending}</h2>
            </div>
            <Clock size={32} color="var(--warning-color)" opacity={0.2} />
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="form-label">Urgent</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{stats.urgent}</h2>
            </div>
            <AlertCircle size={32} color="var(--danger-color)" opacity={0.2} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
