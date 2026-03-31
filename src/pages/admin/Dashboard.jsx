import { useState, useEffect } from 'react'
import { GraduationCap, Users, UserCheck, DollarSign, TrendingUp, Calendar, BookOpen, Bell } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { PageHeader, StatCard, StatCardSkeleton } from '../../components/UI'
import { supabase } from '../../services/supabase'

const earningsData = [
  { month: 'Jan', total: 45000, fees: 15000 },
  { month: 'Feb', total: 52000, fees: 18000 },
  { month: 'Mar', total: 48000, fees: 12000 },
  { month: 'Apr', total: 61000, fees: 22000 },
  { month: 'May', total: 55000, fees: 17000 },
  { month: 'Jun', total: 67000, fees: 25000 },
  { month: 'Jul', total: 72000, fees: 28000 },
  { month: 'Aug', total: 65000, fees: 21000 },
  { month: 'Sep', total: 75000, fees: 30000 },
  { month: 'Oct', total: 80000, fees: 35000 },
  { month: 'Nov', total: 78000, fees: 33000 },
  { month: 'Dec', total: 90000, fees: 40000 },
]

const expensesData = [
  { month: 'Jan 2024', amount: 15000 },
  { month: 'Feb 2024', amount: 10000 },
  { month: 'Mar 2024', amount: 8000 },
  { month: 'Apr 2024', amount: 12000 },
  { month: 'May 2024', amount: 9000 },
]

const studentGenderData = [
  { name: 'Male', value: 55, color: '#3498db' },
  { name: 'Female', value: 35, color: '#ffae01' },
  { name: 'Other', value: 10, color: '#3cb878' },
]

const recentStudents = [
  { id: '#001', name: 'Alice Johnson', class: '10th', subject: 'Math', status: 'Active' },
  { id: '#002', name: 'Bob Smith', class: '9th', subject: 'Science', status: 'Active' },
  { id: '#003', name: 'Carol White', class: '11th', subject: 'English', status: 'Inactive' },
  { id: '#004', name: 'David Brown', class: '8th', subject: 'History', status: 'Active' },
  { id: '#005', name: 'Eva Davis', class: '12th', subject: 'Physics', status: 'Active' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
        <p className="font-semibold mb-1" style={{ color: '#042954' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: ${p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, attendance: 0, earnings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const [{ count: students }, { count: teachers }, { count: attendance }] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('teachers').select('*', { count: 'exact', head: true }),
          supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('status', 'present'),
        ])
        setStats({
          students: students || 150000,
          teachers: teachers || 2250,
          attendance: attendance || 94,
          earnings: 193000,
        })
      } catch {
        // Demo data fallback
        setStats({ students: 150000, teachers: 2250, attendance: 94, earnings: 193000 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="animate-fade-in">
      <PageHeader title="Admin Dashboard" subtitle="Admin" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Students"
              value={stats.students}
              icon={GraduationCap}
              color="#3cb878"
              bgColor="#e8f8f0"
            />
            <StatCard
              title="Teachers"
              value={stats.teachers}
              icon={Users}
              color="#3498db"
              bgColor="#e3f2fd"
            />
            <StatCard
              title="Attendance %"
              value={`${stats.attendance}%`}
              icon={UserCheck}
              color="#ff9d01"
              bgColor="#fff3e0"
            />
            <StatCard
              title="Earnings"
              value={`$${(stats.earnings).toLocaleString()}`}
              icon={DollarSign}
              color="#ff636e"
              bgColor="#ffe8e9"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Earnings Chart */}
        <div className="xl:col-span-2 card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Earnings</h3>
              <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#646464' }}>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#3498db' }} />
                  Total Collections: <strong style={{ color: '#042954' }}>&nbsp;$75,000</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#ff636e' }} />
                  Fees: <strong style={{ color: '#042954' }}>&nbsp;$15,000</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="feesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff636e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff636e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#646464' }} />
                <YAxis tick={{ fontSize: 11, fill: '#646464' }} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" name="Total Collections"
                  stroke="#3498db" fill="url(#totalGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="fees" name="Fees Collection"
                  stroke="#ff636e" fill="url(#feesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students Donut */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Students</h3>
          </div>
          <div className="card-body flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={studentGenderData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  dataKey="value"
                >
                  {studentGenderData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {studentGenderData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs" style={{ color: '#646464' }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses + Recent Students */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Expenses Bar */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Expenses</h3>
          </div>
          <div className="card-body">
            <div className="flex gap-4 mb-3 text-xs" style={{ color: '#646464' }}>
              {expensesData.slice(0, 3).map(d => (
                <div key={d.month}>
                  <div className="font-semibold" style={{ color: '#042954' }}>
                    ${d.amount.toLocaleString()}
                  </div>
                  <div>{d.month}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#646464' }} />
                <YAxis tick={{ fontSize: 10, fill: '#646464' }} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip formatter={v => [`$${v.toLocaleString()}`]} />
                <Bar dataKey="amount" name="Expenses" radius={[4,4,0,0]}>
                  {expensesData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? '#3cb878' : '#3498db'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Students Table */}
        <div className="xl:col-span-2 card">
          <div className="card-header">
            <h3 className="card-title">Recent Students</h3>
            <a href="/admin/students" className="text-sm font-medium" style={{ color: '#ffae01' }}>
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map(s => (
                  <tr key={s.id}>
                    <td className="font-medium" style={{ color: '#042954' }}>{s.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                             style={{ background: '#3498db' }}>
                          {s.name[0]}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.class}</td>
                    <td>{s.subject}</td>
                    <td>
                      <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
