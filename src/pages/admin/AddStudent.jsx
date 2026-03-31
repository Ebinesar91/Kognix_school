import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock, Hash, Calendar } from 'lucide-react'
import { PageHeader } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History']

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', register_no: '',
    department: '', year: 1, phone: '', address: '', dob: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Password min 6 chars'
    if (!form.register_no.trim()) e.register_no = 'Register number required'
    if (!form.department) e.department = 'Department required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // 1. Create a temporary Supabase client with persistSession: false
      // This prevents the new user signup from logging out the Admin!
      // NOTE: For true Admin User Creation, you would usually use the Service Role Key in a backend (Express).
      const { createClient } = await import('@supabase/supabase-js');
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false } }
      );

      // 2. Register the student
      const { data: authData, error: authErr } = await tempClient.auth.signUp({
        email: form.email,
        password: form.password,
      })
      
      if (authErr) throw authErr
      if (!authData.user) throw new Error('Failed to create account - possibly duplicate email')

      // Insert user profile
      const { error: userErr } = await supabase.from('users').insert({
        id: authData.user.id,
        name: form.name,
        email: form.email,
        role: 'student',
      })
      if (userErr) throw userErr

      // Insert student record
      const { error: studentErr } = await supabase.from('students').insert({
        id: authData.user.id,
        register_no: form.register_no,
        department: form.department,
        year: form.year,
      })
      if (studentErr) throw studentErr

      toast.success('Student added successfully!')
      navigate('/admin/students')
    } catch (err) {
      toast.error(err.message || 'Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Add Student" subtitle="Students">
        <button onClick={() => navigate(-1)} className="btn-navy flex items-center gap-2">
          <ArrowLeft size={15} /> Back
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left: Avatar preview */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Student Photo</h3>
            </div>
            <div className="card-body flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                   style={{ background: '#3498db' }}>
                {form.name?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="text-sm text-center" style={{ color: '#646464' }}>
                {form.name || 'Student Name'}
              </p>
              <div className="w-full">
                <InputGroup label="Register Number" icon={Hash} error={errors.register_no}>
                  <input
                    type="text" value={form.register_no}
                    onChange={e => set('register_no', e.target.value)}
                    placeholder="REG2024001"
                    className="form-input pl-9"
                    style={errors.register_no ? { borderColor: '#ff636e' } : {}}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="xl:col-span-2 space-y-5">
            {/* Personal Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Full Name" icon={User} error={errors.name}>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="John Doe" className="form-input pl-9"
                      style={errors.name ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Email Address" icon={Mail} error={errors.email}>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="student@email.com" className="form-input pl-9"
                      style={errors.email ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Password" icon={Lock} error={errors.password}>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                      placeholder="Min. 6 characters" className="form-input pl-9"
                      style={errors.password ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Phone Number">
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+1 234 567 8900" className="form-input" />
                  </InputGroup>

                  <InputGroup label="Date of Birth" icon={Calendar} error={null}>
                    <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                      className="form-input pl-9" />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Academic Information</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Department</label>
                    <select value={form.department} onChange={e => set('department', e.target.value)}
                      className="form-input"
                      style={errors.department ? { borderColor: '#ff636e' } : {}}>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.department && <p className="text-xs mt-1 text-red-500">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="form-label">Year of Study</label>
                    <select value={form.year} onChange={e => set('year', parseInt(e.target.value))}
                      className="form-input">
                      {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Address</label>
                    <textarea value={form.address} onChange={e => set('address', e.target.value)}
                      placeholder="123 Main Street, City, State"
                      rows={3} className="form-input resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pb-4">
              <button type="button" onClick={() => navigate(-1)} className="btn-navy">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : null
                }
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

const InputGroup = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="form-label">{label}</label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      {children}
    </div>
    {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
  </div>
)

