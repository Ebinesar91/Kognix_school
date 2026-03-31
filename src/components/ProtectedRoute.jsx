import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './UI'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f1f3' }}>
        <div className="text-center">
          <Spinner size={48} />
          <p className="mt-4 text-sm" style={{ color: '#646464' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to their own dashboard
    const role = profile.role || 'student'
    return <Navigate to={`/${role}/dashboard`} replace />
  }

  return children
}
