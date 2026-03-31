import { useState, useEffect } from 'react'
import { GraduationCap, ClipboardList, Trophy, FileText, TrendingUp } from 'lucide-react'
import { PageHeader } from '../../components/UI'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ attendance: 0, tests: 0, avgScore: 0 })
  const [results, setResults] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function fetchData() {
    setLoading(true)
    try {
      const [attRes, resRes] = await Promise.all([
        supabase.from('attendance').select('status').eq('student_id', profile.id),
        supabase.from('results').select('*, tests(title)').eq('student_id', profile.id).order('created_at'),
      ])

      const att = attRes.data || []
      const presentCount = att.filter(a => a.status === 'present').length
      const attPct = att.length > 0 ? Math.round((presentCount / att.length) * 100) : 0

      const fetchedResults = resRes.data || []
      const avgScore = fetchedResults.length > 0
        ? Math.round(fetchedResults.reduce((s, r) => s + r.score, 0) / fetchedResults.length)
        : 0

      setStats({ attendance: attPct, tests: fetchedResults.length, avgScore })
      setResults(fetchedResults.slice(-8))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const chartData = results.map((r, i) => ({
    name: `Test ${i + 1}`,
    score: r.score,
    title: r.tests?.title,
  }))

  return (
    <div className="animate-fade-in">
      <PageHeader title="Student Dashboard" subtitle="Dashboard" />

      {/* About Me Card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">About Me</h3>
          </div>
          <div className="card-body flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                 style={{ background: '#3498db' }}>
              {profile?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: '#042954' }}>{profile?.name}</div>
              <div className="text-sm mt-0.5" style={{ color: '#646464' }}>Student</div>
            </div>
            <div className="w-full space-y-2 text-sm text-left">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span style={{ color: '#646464' }}>Name:</span>
                <span className="font-medium" style={{ color: '#042954' }}>{profile?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span style={{ color: '#646464' }}>Email:</span>
                <span className="font-medium text-xs" style={{ color: '#042954' }}>{profile?.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span style={{ color: '#646464' }}>Role:</span>
                <span className="badge badge-info capitalize">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                   style={{ background: '#f3e5ff' }}>
                <ClipboardList size={22} color="#9b59b6" />
              </div>
              <div className="text-sm" style={{ color: '#646464' }}>Notifications</div>
              <div className="text-2xl font-bold" style={{ color: '#042954' }}>12</div>
            </div>
            <div className="card p-5 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                   style={{ background: '#e3f2fd' }}>
                <FileText size={22} color="#3498db" />
              </div>
              <div className="text-sm" style={{ color: '#646464' }}>Events</div>
              <div className="text-2xl font-bold" style={{ color: '#042954' }}>6</div>
            </div>
            <div className="card p-5 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                   style={{ background: '#fff3e0' }}>
                <TrendingUp size={22} color="#ff9d01" />
              </div>
              <div className="text-sm" style={{ color: '#646464' }}>Attendance</div>
              <div className="text-2xl font-bold" style={{ color: '#042954' }}>{stats.attendance}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Exam Results */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Score trend */}
        {chartData.length > 0 ? (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Score Trend</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#646464' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#646464' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="#ffae01" strokeWidth={2.5}
                    dot={{ fill: '#ffae01', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <Trophy size={48} className="mb-4" style={{ color: '#ffae01', opacity: 0.4 }} />
            <p className="font-semibold" style={{ color: '#042954' }}>No test results yet</p>
            <p className="text-sm mt-1" style={{ color: '#646464' }}>Take a test to see your score trend</p>
          </div>
        )}

        {/* Exam Results Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Exam Results</h3>
            <Link to="/student/results" className="text-sm" style={{ color: '#ffae01' }}>View All</Link>
          </div>
          {results.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#646464' }}>No results yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Exam Name</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const score = r.score
                    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'F'
                    const gradeColor = score >= 70 ? '#3cb878' : '#ff636e'
                    return (
                      <tr key={r.id}>
                        <td style={{ color: '#646464' }}>#{String(i + 21).padStart(4, '0')}</td>
                        <td style={{ color: '#042954', fontWeight: 500 }}>{r.tests?.title || 'Test'}</td>
                        <td>
                          <span className="font-bold" style={{ color: '#042954' }}>{score}</span>
                          <span className="text-gray-400 text-xs"> / 100</span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: `${gradeColor}15`, color: gradeColor }}>
                            {grade}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#646464' }}>
                          {new Date(r.created_at).toLocaleDateString()}
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
    </div>
  )
}
