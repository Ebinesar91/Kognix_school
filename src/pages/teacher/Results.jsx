import { useResults } from '../../hooks/useData'
import { useAuth } from '../../hooks/useAuth'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { Trophy, BarChart2 } from 'lucide-react'

export default function TeacherResults() {
  useAuth()
  const { results, loading } = useResults(null, null)

  function getGrade(score) {
    if (score >= 90) return { grade: 'A+', color: '#3cb878' }
    if (score >= 80) return { grade: 'A', color: '#3498db' }
    if (score >= 70) return { grade: 'B', color: '#ff9d01' }
    if (score >= 60) return { grade: 'C', color: '#ff9d01' }
    return { grade: 'F', color: '#ff636e' }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Student Results" subtitle="Results" />
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Results</h3>
        </div>
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : results.length === 0 ? (
          <EmptyState message="No results found" icon={Trophy} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => {
                  const { grade, color } = getGrade(r.score)
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                               style={{ background: '#3498db' }}>
                            {r.students?.users?.name?.[0] || 'S'}
                          </div>
                          <span className="font-medium" style={{ color: '#042954' }}>
                            {r.students?.users?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#646464' }}>{r.tests?.title}</td>
                      <td>
                        <span className="font-bold" style={{ color: '#042954' }}>{r.score}%</span>
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${color}18`, color }}>{grade}</span>
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
  )
}
