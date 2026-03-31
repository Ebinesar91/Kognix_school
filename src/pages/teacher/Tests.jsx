import { useAuth } from '../../hooks/useAuth'
import { useTests } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { FileText, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TeacherTests() {
  const { profile } = useAuth()
  const { tests, loading } = useTests(profile?.id)

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Tests" subtitle="Tests">
        <Link to="/teacher/tests/create">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Create Test
          </button>
        </Link>
      </PageHeader>
      <div className="card">
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : tests.length === 0 ? (
          <EmptyState message="No tests created yet" icon={FileText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Questions</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ color: '#646464' }}>{i + 1}</td>
                    <td className="font-medium" style={{ color: '#042954' }}>{t.title}</td>
                    <td><span className="badge badge-info">{t.questions?.length || 0} Qs</span></td>
                    <td style={{ fontSize: '12px', color: '#646464' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
