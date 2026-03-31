import { useResults } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { BarChart2, Trophy } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

export default function Results() {
  const { results, loading } = useResults()

  // Build chart data
  const testScores = results.reduce((acc, r) => {
    const title = r.tests?.title || 'Unknown'
    if (!acc[title]) acc[title] = { name: title, avg: 0, count: 0, total: 0 }
    acc[title].total += r.score
    acc[title].count++
    acc[title].avg = Math.round(acc[title].total / acc[title].count)
    return acc
  }, {})
  const chartData = Object.values(testScores).slice(0, 8)

  const colors = ['#3498db', '#3cb878', '#ff9d01', '#9b59b6', '#ff636e', '#1abc9c', '#e74c3c', '#f39c12']

  function getGrade(score, total) {
    const pct = (score / total) * 100
    if (pct >= 90) return { grade: 'A+', color: '#3cb878' }
    if (pct >= 80) return { grade: 'A', color: '#3498db' }
    if (pct >= 70) return { grade: 'B', color: '#ff9d01' }
    if (pct >= 60) return { grade: 'C', color: '#ff636e' }
    return { grade: 'F', color: '#ff636e' }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Exam Results" subtitle="Results" />

      {chartData.length > 0 && (
        <div className="card mb-5">
          <div className="card-header">
            <h3 className="card-title">Average Scores by Test</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#646464' }} />
                <YAxis tick={{ fontSize: 11, fill: '#646464' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  formatter={v => [`${v}%`, 'Avg Score']} />
                <Bar dataKey="avg" name="Avg Score" radius={[4,4,0,0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Results</h3>
        </div>
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : results.length === 0 ? (
          <EmptyState message="No results available" icon={Trophy} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Register No</th>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => {
                  const { grade, color } = getGrade(result.score, 100)
                  return (
                    <tr key={result.id}>
                      <td style={{ color: '#646464' }}>{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                               style={{ background: '#3498db' }}>
                            {result.students?.users?.name?.[0] || 'S'}
                          </div>
                          <span className="font-medium" style={{ color: '#042954' }}>
                            {result.students?.users?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="font-mono text-xs">{result.students?.register_no || '—'}</td>
                      <td style={{ color: '#646464' }}>{result.tests?.title || 'Unknown'}</td>
                      <td>
                        <div className="font-bold" style={{ color: '#042954' }}>
                          {result.score}<span className="text-gray-400 font-normal text-xs">/100</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${color}18`, color }}>
                          {grade}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: '#646464' }}>
                        {new Date(result.created_at).toLocaleDateString()}
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
