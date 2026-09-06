import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckSquare, LogOut, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <CheckSquare size={24} color="var(--primary-color)" />
          <span>TaskManager</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/tasks" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>
              <CheckSquare size={18} />
              <span>Tasks</span>
            </Link>
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
              <LogOut size={18} className="mr-2" style={{ marginRight: '0.5rem' }} />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="btn" style={{ background: 'transparent', color: 'var(--primary-color)' }}>Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
