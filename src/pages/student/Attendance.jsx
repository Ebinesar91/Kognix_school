import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import { PageHeader, Spinner } from '../../components/UI'
import { Calendar, Check, X } from 'lucide-react'

export default function StudentAttendance() {
  const { profile } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    if (profile) fetchAttendance()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, monthYear])

  async function fetchAttendance() {
    setLoading(true)
    try {
      const [year, month] = monthYear.split('-')
      const startDate = `${year}-${month}-01`
      const endDate = `${year}-${month}-31`

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', profile.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (error) throw error
      setAttendance(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const presentCount = attendance.filter(a => a.status === 'present').length
  const absentCount = attendance.filter(a => a.status === 'absent').length
  const total = attendance.length
  const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0

  const attMap = {}
  attendance.forEach(a => { attMap[a.date] = a.status })

  // Get days in selected month
  const [year, month] = monthYear.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, '0')
    const date = `${year}-${String(month).padStart(2, '0')}-${d}`
    return { day: i + 1, date, status: attMap[date] || null }
  })

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Attendance" subtitle="Attendance" />

      {/* Filter */}
      <div className="card mb-5">
        <div className="card-body flex items-center gap-4">
          <div>
            <label className="form-label">Month / Year</label>
            <input
              type="month"
              value={monthYear}
              onChange={e => setMonthYear(e.target.value)}
              className="form-input w-48"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold" style={{ color: '#3cb878' }}>{presentCount}</div>
          <div className="text-sm mt-1" style={{ color: '#646464' }}>Present Days</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold" style={{ color: '#ff636e' }}>{absentCount}</div>
          <div className="text-sm mt-1" style={{ color: '#646464' }}>Absent Days</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold" style={{ color: pct >= 75 ? '#3498db' : '#ff636e' }}>{pct}%</div>
          <div className="text-sm mt-1" style={{ color: '#646464' }}>Percentage</div>
          {pct < 75 && (
            <div className="text-xs mt-1" style={{ color: '#ff636e' }}>⚠ Below 75%</div>
          )}
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Attendance for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              Present
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              Absent
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
              No record
            </span>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Spinner size={36} /></div>
          ) : (
            <div className="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-15 gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))' }}>
              {days.map(({ day, date, status }) => (
                <div
                  key={date}
                  className="flex flex-col items-center justify-center p-2 rounded-xl text-center"
                  style={{
                    background: status === 'present' ? '#e8f8f0'
                      : status === 'absent' ? '#ffe8e9'
                      : '#f8f9fa',
                    border: `1px solid ${
                      status === 'present' ? '#3cb878'
                      : status === 'absent' ? '#ff636e'
                      : '#e1e1e1'
                    }`
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: '#042954' }}>{day}</div>
                  <div className="mt-1">
                    {status === 'present' ? <Check size={14} color="#3cb878" />
                     : status === 'absent' ? <X size={14} color="#ff636e" />
                     : <span style={{ color: '#bbb', fontSize: '12px' }}>—</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
