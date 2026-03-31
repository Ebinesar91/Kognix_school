import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock, BookOpen, Calendar, Phone, MapPin } from 'lucide-react'
import { PageHeader } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History']
const designations = ['Principal', 'Vice Principal', 'HOD', 'Senior Teacher', 'Teacher', 'Assistant Teacher', 'Lab Assistant', 'Physical Trainer']

export default function AddTeacher() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', 
    department: '', phone: '', address: '', dob: '', designation: 'Teacher'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Password min 6 chars'
    if (!form.department) e.department = 'Department required'
    if (!form.designation.trim()) e.designation = 'Designation required'
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
      const { createClient } = await import('@supabase/supabase-js');
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false } }
      );

      // 2. Register the teacher
      const { data: authData, error: authErr } = await tempClient.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authErr) throw authErr
      if (!authData.user) throw new Error('Failed to create account - possibly duplicate email')

      // 3. Insert user profile into public.users
      const { error: userErr } = await supabase.from('users').insert({
        id: authData.user.id,
        name: form.name,
        email: form.email,
        role: 'teacher',
      })
      if (userErr) throw userErr

      // 4. Insert teacher record (including the new designation field)
      const { error: teacherErr } = await supabase.from('teachers').insert({
        id: authData.user.id,
        department: form.department,
        designation: form.designation,
      })
      if (teacherErr) throw teacherErr


      toast.success('Teacher added successfully!')
      navigate('/admin/teachers')
    } catch (err) {
      toast.error(err.message || 'Failed to add teacher')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Add Teacher" subtitle="Teachers">
        <button type="button" onClick={() => navigate(-1)} className="btn-navy flex items-center gap-2">
          <ArrowLeft size={15} /> Back
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left: Avatar preview */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Teacher Profile</h3>
            </div>
            <div className="card-body flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                   style={{ background: '#3cb878' }}>
                {form.name?.[0]?.toUpperCase() || 'T'}
              </div>
              <p className="text-sm text-center font-bold" style={{ color: '#042954' }}>
                {form.name || 'Teacher Name'}
              </p>
              <div className="w-full">
                <InputGroup label="Designation" icon={BookOpen} error={errors.designation}>
                  <select
                    value={form.designation}
                    onChange={e => set('designation', e.target.value)}
                    className="form-input pl-9"
                    style={errors.designation ? { borderColor: '#ff636e' } : {}}
                  >
                    {designations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
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
                      placeholder="Jane Doe" className="form-input pl-9"
                      style={errors.name ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Email Address" icon={Mail} error={errors.email}>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="teacher@school.com" className="form-input pl-9"
                      style={errors.email ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Password" icon={Lock} error={errors.password}>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                      placeholder="Min. 6 characters" className="form-input pl-9"
                      style={errors.password ? { borderColor: '#ff636e' } : {}} />
                  </InputGroup>

                  <InputGroup label="Phone Number" icon={Phone}>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+1 234 567 8900" className="form-input pl-9" />
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
                <h3 className="card-title">Academic Details</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 gap-4">
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
                    <label className="form-label">Address</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                      <textarea value={form.address} onChange={e => set('address', e.target.value)}
                        placeholder="123 Staff Quarters, City"
                        rows={3} className="form-input pl-9 resize-none" />
                    </div>
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
                {loading ? 'Adding...' : 'Add Teacher'}
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

