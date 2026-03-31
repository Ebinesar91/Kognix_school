import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, School } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const result = await signIn(form.email, form.password)
      toast.success('Welcome back!')
      const role = result?.role || localStorage.getItem('userRole') || 'student'
      navigate(`/${role}/dashboard`)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #042954 0%, #0a3d7a 50%, #042954 100%)',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: '#ffae01' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: '#ffae01' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-2xl"
               style={{ background: '#0B213F', border: '4px solid rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 100 100" className="w-14 h-14">
              <circle cx="50" cy="30" r="12" fill="#F17A28" />
              <path d="M35 80 V40 M35 60 L65 40 M35 60 L65 80" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-widest">KOGNIX</h1>
          <p className="text-white/60 text-sm mt-2 font-medium tracking-tight">Smart School Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#042954' }}>Sign In</h2>
            <p className="text-sm mt-1" style={{ color: '#646464' }}>
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@school.com"
                  className="form-input pl-10"
                  style={errors.email ? { borderColor: '#ff636e' } : {}}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#ff636e' }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="form-input pl-10 pr-10"
                  style={errors.password ? { borderColor: '#ff636e' } : {}}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#ff636e' }}>{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium"
                style={{ color: '#ffae01' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
              style={{ padding: '12px' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: '#646464' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#042954' }}>
              Register here
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: '#f0f1f3' }}>
            <p className="font-semibold mb-2" style={{ color: '#042954' }}>Demo Credentials:</p>
            <div className="space-y-1 text-xs" style={{ color: '#646464' }}>
              <p>Admin: admin@school.com / admin123</p>
              <p>Teacher: teacher@school.com / teacher123</p>
              <p>Student: student@school.com / student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
