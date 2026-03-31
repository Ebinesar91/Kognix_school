import { PageHeader } from '../../components/UI'
import { BarChart2, Users, GraduationCap, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const monthlyData = [
  { month: 'Jan', students: 120, teachers: 25, attendance: 88 },
  { month: 'Feb', students: 135, teachers: 26, attendance: 91 },
  { month: 'Mar', students: 128, teachers: 25, attendance: 85 },
  { month: 'Apr', students: 145, teachers: 28, attendance: 93 },
  { month: 'May', students: 130, teachers: 27, attendance: 89 },
  { month: 'Jun', students: 142, teachers: 29, attendance: 94 },
]

const deptData = [
  { name: 'CS', value: 35, color: '#3498db' },
  { name: 'Maths', value: 20, color: '#3cb878' },
  { name: 'Physics', value: 18, color: '#ff9d01' },
  { name: 'Chemistry', value: 15, color: '#9b59b6' },
  { name: 'Biology', value: 12, color: '#ff636e' },
]

export default function Reports() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Reports" subtitle="Reports" />

      {/* Summary Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Total Enrollments', value: '1,245', icon: GraduationCap, color: '#3cb878', bg: '#e8f8f0' },
          { label: 'Avg Attendance', value: '91%', icon: BarChart2, color: '#3498db', bg: '#e3f2fd' },
          { label: 'Tests Conducted', value: '48', icon: TrendingUp, color: '#ff9d01', bg: '#fff3e0' },
          { label: 'Pass Rate', value: '87%', icon: Users, color: '#9b59b6', bg: '#f3e5ff' },
        ].map(item => (
          <div key={item.label} className="stat-card">
            <div className="stat-icon" style={{ background: item.bg }}>
              <item.icon size={26} color={item.color} />
            </div>
            <div>
              <div className="text-sm" style={{ color: '#646464' }}>{item.label}</div>
              <div className="text-2xl font-bold" style={{ color: '#042954' }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Monthly trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Attendance Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#646464' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: '#646464' }} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={v => [`${v}%`]} />
                <Line type="monotone" dataKey="attendance" name="Attendance %"
                  stroke="#3cb878" strokeWidth={2.5} dot={{ fill: '#3cb878', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Students by Department</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90} dataKey="value">
                  {deptData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student + Teacher count */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Monthly Enrollment</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#646464' }} />
              <YAxis tick={{ fontSize: 12, fill: '#646464' }} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="students" name="Students" fill="#3498db" radius={[3,3,0,0]} />
              <Bar dataKey="teachers" name="Teachers" fill="#3cb878" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
