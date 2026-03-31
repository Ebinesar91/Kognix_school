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
         style={{ background: 'linear-gradient(135deg, #0B213F 0%, #0a3d7a 50%, #0B213F 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-2xl"
               style={{ background: '#0B213F', border: '4px solid rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 100 100" className="w-14 h-14">
              <circle cx="50" cy="30" r="12" fill="#F17A28" />
              <path d="M35 80 V40 M35 60 L65 40 M35 60 L65 80" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-widest">KOGNIX</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ background: '#e8f8f0' }}>
                <Mail size={32} color="#3cb878" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#0B213F' }}>Check Your Email</h2>
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
                <h2 className="text-xl font-bold" style={{ color: '#0B213F' }}>Forgot Password</h2>
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
                    style={{ color: '#0B213F' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
