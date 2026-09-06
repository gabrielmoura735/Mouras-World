import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import Register from './pages/Register'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
