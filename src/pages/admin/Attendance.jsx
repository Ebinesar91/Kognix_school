import { useState, useEffect } from 'react'
import { Calendar, Check, X, Filter, Save } from 'lucide-react'
import { PageHeader, Spinner } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']

// Format today's date as YYYY-MM-DD
function today() {
  return new Date().toISOString().split('T')[0]
}

export default function Attendance() {
  const [date, setDate] = useState(today())
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [attendance, setAttendance] = useState({}) // { studentId: 'present' | 'absent' }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (department) fetchStudentsWithAttendance()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, department, year])

  async function fetchStudentsWithAttendance() {
    setLoadingStudents(true)
    try {
      // Fetch students
      let q = supabase
        .from('students')
        .select('id, register_no, department, year, users(name)')
        .eq('department', department)

      if (year) q = q.eq('year', parseInt(year))
      const { data: studs, error } = await q
      if (error) throw error

      // Fetch existing attendance for this date
      const studentIds = studs?.map(s => s.id) || []
      const { data: attData } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('date', date)
        .in('student_id', studentIds)

      // Build attendance map
      const attMap = {}
      attData?.forEach(a => { attMap[a.student_id] = a.status })

      setStudents(studs || [])
      setAttendance(attMap)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }

  function toggleStatus(studentId) {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent'
        : prev[studentId] === 'absent' ? 'present'
        : 'present'
    }))
  }

  function markAll(status) {
    const map = {}
    students.forEach(s => { map[s.id] = status })
    setAttendance(map)
  }

  async function handleSave() {
    if (students.length === 0) return toast.error('No students loaded')
    setSaving(true)
    try {
      const records = students.map(s => ({
        student_id: s.id,
        date: date,
        status: attendance[s.id] || 'absent',
      }))

      const { error } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'student_id,date' })

      if (error) throw error
      toast.success(`Attendance saved for ${date}!`)
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const presentCount = students.filter(s => attendance[s.id] === 'present').length
  const absentCount = students.filter(s => attendance[s.id] === 'absent').length
  const percentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0

  return (
    <div className="animate-fade-in">
      <PageHeader title="Attendance" subtitle="Attendance">
        <button onClick={handleSave} disabled={saving || students.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          Save Attendance
        </button>
      </PageHeader>

      {/* Filter Card */}
      <div className="card mb-5">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2">
            <Filter size={16} /> Filter
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="form-input" max={today()} />
            </div>
            <div>
              <label className="form-label">Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}
                className="form-input">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="form-input">
                <option value="">All Years</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#e8f8f0' }}>
              <Check size={18} color="#3cb878" />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#3cb878' }}>{presentCount}</div>
              <div className="text-xs" style={{ color: '#646464' }}>Present</div>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#ffe8e9' }}>
              <X size={18} color="#ff636e" />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#ff636e' }}>{absentCount}</div>
              <div className="text-xs" style={{ color: '#646464' }}>Absent</div>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#e3f2fd' }}>
              <Calendar size={18} color="#3498db" />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#3498db' }}>{percentage}%</div>
              <div className="text-xs" style={{ color: '#646464' }}>Percentage</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Attendance Table */}
      <div className="card">
        {students.length > 0 && (
          <div className="card-header">
            <div className="flex items-center gap-2">
              <h3 className="card-title">
                {department} - Year {year || 'All'} &nbsp;|&nbsp;
                <span style={{ color: '#646464', fontWeight: 400, fontSize: '14px' }}>{date}</span>
              </h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAll('present')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: '#e8f8f0', color: '#3cb878' }}>
                <Check size={12} /> All Present
              </button>
              <button onClick={() => markAll('absent')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: '#ffe8e9', color: '#ff636e' }}>
                <X size={12} /> All Absent
              </button>
            </div>
          </div>
        )}

        {!department ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar size={56} className="mb-4 opacity-20" style={{ color: '#042954' }} />
            <p className="font-semibold" style={{ color: '#042954' }}>Select a department to view attendance</p>
            <p className="text-sm mt-1" style={{ color: '#646464' }}>Choose department and date from the filter above</p>
          </div>
        ) : loadingStudents ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={36} />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p style={{ color: '#646464' }}>No students found for selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Register No</th>
                  <th>Student Name</th>
                  <th>Year</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Toggle</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => {
                  const status = attendance[student.id]
                  const isPresent = status === 'present'
                  const isAbsent = status === 'absent'
                  return (
                    <tr key={student.id}>
                      <td style={{ color: '#646464' }}>{i + 1}</td>
                      <td className="font-mono text-xs">{student.register_no}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                               style={{ background: isPresent ? '#3cb878' : isAbsent ? '#ff636e' : '#e1e1e1' }}>
                            {student.users?.name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <span className="font-medium" style={{ color: '#042954' }}>
                            {student.users?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td><span className="badge badge-navy">Year {student.year}</span></td>
                      <td className="text-center">
                        {isPresent && <span className="badge badge-success">Present</span>}
                        {isAbsent && <span className="badge badge-danger">Absent</span>}
                        {!status && <span className="badge" style={{ background: '#f0f1f3', color: '#646464' }}>—</span>}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => toggleStatus(student.id)}
                          className={`att-btn mx-auto ${isPresent ? 'present' : isAbsent ? 'absent' : 'default'}`}
                        >
                          {isPresent ? '✓' : isAbsent ? '✗' : '?'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
