import { useEffect, useState } from 'react'
import { GraduationCap, Users, ClipboardList, FileText, TrendingUp, Calendar } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/UI'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const demoAttendance = [
  { day: 'Mon', present: 28, absent: 4 },
  { day: 'Tue', present: 30, absent: 2 },
  { day: 'Wed', present: 25, absent: 7 },
  { day: 'Thu', present: 29, absent: 3 },
  { day: 'Fri', present: 27, absent: 5 },
]

export default function TeacherDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ students: 0, tests: 0, attendance: 0 })
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const { count: tests } = await supabase
          .from('tests')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', profile?.id)

        setStats({ students: 120, tests: tests || 5, attendance: 94 })
      } catch {
        setStats({ students: 120, tests: 5, attendance: 94 })
      } finally {
        setLoading(false)
      }
    }
    if (profile) fetchStats()
  }, [profile])

  return (
    <div className="animate-fade-in">
      <PageHeader title="Teacher Dashboard" subtitle="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard title="My Students" value={stats.students} icon={GraduationCap} color="#3cb878" bgColor="#e8f8f0" />
        <StatCard title="My Tests" value={stats.tests} icon={FileText} color="#3498db" bgColor="#e3f2fd" />
        <StatCard title="Avg Attendance %" value={`${stats.attendance}%`} icon={ClipboardList} color="#ff9d01" bgColor="#fff3e0" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Attendance Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Attendance</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={demoAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#646464' }} />
                <YAxis tick={{ fontSize: 12, fill: '#646464' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="present" name="Present" fill="#3cb878" radius={[4,4,0,0]} />
                <Bar dataKey="absent" name="Absent" fill="#ff636e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body space-y-3">
            {[
              { label: 'Mark Attendance', icon: ClipboardList, color: '#3cb878', bg: '#e8f8f0', path: '/teacher/attendance' },
              { label: 'Create New Test', icon: FileText, color: '#3498db', bg: '#e3f2fd', path: '/teacher/tests/create' },
              { label: 'View Students', icon: GraduationCap, color: '#ff9d01', bg: '#fff3e0', path: '/teacher/students' },
              { label: 'View Results', icon: TrendingUp, color: '#9b59b6', bg: '#f3e5ff', path: '/teacher/results' },
            ].map(action => (
              <a
                key={action.label}
                href={action.path}
                className="flex items-center gap-4 p-3 rounded-xl transition-all hover:shadow-md"
                style={{ border: '1px solid #e1e1e1' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: action.bg }}>
                  <action.icon size={18} color={action.color} />
                </div>
                <span className="font-medium" style={{ color: '#042954' }}>{action.label}</span>
                <span className="ml-auto text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
