import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Mock login for now
      // const response = await axios.post('/auth/login', { email, password })
      // login(response.data.token, response.data.user)
      
      // Temporary mock
      login('fake-jwt-token-123', { email })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex" style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to TaskManager</h2>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
