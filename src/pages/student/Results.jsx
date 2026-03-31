import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { Trophy } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function StudentResults() {
  const { profile } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchResults()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function fetchResults() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*, tests(title)')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResults(data || [])
    } finally {
      setLoading(false)
    }
  }

  const chartData = [...results].reverse().map((r, i) => ({
    name: `T${i + 1}`,
    score: r.score,
    title: r.tests?.title
  }))

  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0

  function getGrade(score) {
    if (score >= 90) return { grade: 'A+', color: '#3cb878' }
    if (score >= 80) return { grade: 'A', color: '#3498db' }
    if (score >= 70) return { grade: 'B', color: '#ff9d01' }
    if (score >= 60) return { grade: 'C', color: '#ff9d01' }
    return { grade: 'F', color: '#ff636e' }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Results" subtitle="Results" />

      {results.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold" style={{ color: '#042954' }}>{results.length}</div>
              <div className="text-sm mt-1" style={{ color: '#646464' }}>Tests Taken</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold" style={{ color: '#ffae01' }}>{avgScore}%</div>
              <div className="text-sm mt-1" style={{ color: '#646464' }}>Average Score</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-3xl font-bold" style={{ color: '#3cb878' }}>
                {Math.max(...results.map(r => r.score))}%
              </div>
              <div className="text-sm mt-1" style={{ color: '#646464' }}>Best Score</div>
            </div>
          </div>

          {/* Chart */}
          <div className="card mb-5">
            <div className="card-header">
              <h3 className="card-title">Score Progress</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#646464' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#646464' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(val, _, props) => [`${val}%`, props.payload.title]}
                  />
                  <Line type="monotone" dataKey="score" stroke="#ffae01" strokeWidth={2.5}
                    dot={{ fill: '#ffae01', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Results Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Results</h3>
        </div>
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : results.length === 0 ? (
          <EmptyState message="No results yet. Take a test!" icon={Trophy} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Exam Name</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Percent</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => {
                  const { grade, color } = getGrade(result.score)
                  return (
                    <tr key={result.id}>
                      <td style={{ color: '#646464' }}>#{String(i + 21).padStart(4, '0')}</td>
                      <td className="font-medium" style={{ color: '#042954' }}>{result.tests?.title}</td>
                      <td>
                        <span className="font-bold" style={{ color: '#042954' }}>{result.score}</span>
                        <span className="text-gray-400 text-xs"> / 100</span>
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${color}18`, color }}>{grade}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full h-1.5" style={{ background: '#f0f1f3' }}>
                            <div className="h-1.5 rounded-full"
                                 style={{ width: `${result.score}%`, background: color }} />
                          </div>
                          <span className="text-xs" style={{ color }}>{result.score}%</span>
                        </div>
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
