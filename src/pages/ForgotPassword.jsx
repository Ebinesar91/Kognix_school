import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, School, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error('Please enter a valid email')
    }
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #042954 0%, #0a3d7a 50%, #042954 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{ background: '#ffae01' }}>
            <School size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AKKHOR</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ background: '#e8f8f0' }}>
                <Mail size={32} color="#3cb878" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#042954' }}>Check Your Email</h2>
              <p className="text-sm mb-6" style={{ color: '#646464' }}>
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login">
                <button className="btn-primary w-full">Back to Sign In</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#042954' }}>Forgot Password</h2>
                <p className="text-sm mt-1" style={{ color: '#646464' }}>
                  Enter your email and we'll send a reset link
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com" className="form-input pl-9" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center" style={{ padding: '12px' }}>
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Send Reset Link'
                  }
                </button>
              </form>
              <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-sm font-medium"
                    style={{ color: '#042954' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
