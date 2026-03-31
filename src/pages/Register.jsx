import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, School, User, Hash } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History']
const years = [1, 2, 3, 4]

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', register_no: '', department: '', year: 1
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (form.role === 'student' && !form.register_no.trim()) e.register_no = 'Register number is required'
    if (!form.department) e.department = 'Department is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signUp(form.email, form.password, {
        name: form.name,
        role: form.role,
        register_no: form.register_no,
        department: form.department,
        year: form.year,
      })
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{ background: 'linear-gradient(135deg, #042954 0%, #0a3d7a 50%, #042954 100%)' }}
    >
      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{ background: '#ffae01' }}>
            <School size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AKKHOR</h1>
          <p className="text-white/60 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#042954' }}>Register</h2>
            <p className="text-sm mt-1" style={{ color: '#646464' }}>Fill in your details below</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 rounded-lg" style={{ background: '#f0f1f3' }}>
            {['student', 'teacher'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => set('role', r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  form.role === r
                    ? 'bg-white shadow text-navy'
                    : 'text-gray-500'
                }`}
                style={form.role === r ? { color: '#042954' } : {}}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="John Doe" className="form-input pl-9"
                  style={errors.name ? { borderColor: '#ff636e' } : {}} />
              </div>
              {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
            </div>

            {/* Register No (student only) */}
            {form.role === 'student' && (
              <div>
                <label className="form-label">Register Number</label>
                <div className="relative">
                  <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.register_no} onChange={e => set('register_no', e.target.value)}
                    placeholder="REG2024001" className="form-input pl-9"
                    style={errors.register_no ? { borderColor: '#ff636e' } : {}} />
                </div>
                {errors.register_no && <p className="text-xs mt-1 text-red-500">{errors.register_no}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@email.com" className="form-input pl-9"
                  style={errors.email ? { borderColor: '#ff636e' } : {}} />
              </div>
              {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
            </div>

            {/* Department + Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)}
                  className="form-input" style={errors.department ? { borderColor: '#ff636e' } : {}}>
                  <option value="">Select</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="text-xs mt-1 text-red-500">{errors.department}</p>}
              </div>
              {form.role === 'student' && (
                <div>
                  <label className="form-label">Year</label>
                  <select value={form.year} onChange={e => set('year', parseInt(e.target.value))}
                    className="form-input">
                    {years.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 6 characters" className="form-input pl-9 pr-9"
                  style={errors.password ? { borderColor: '#ff636e' } : {}} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="••••••••" className="form-input pl-9"
                  style={errors.confirmPassword ? { borderColor: '#ff636e' } : {}} />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1 text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              style={{ padding: '12px' }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create Account'
              }
            </button>
          </form>

          <div className="mt-5 text-center text-sm" style={{ color: '#646464' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#042954' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
