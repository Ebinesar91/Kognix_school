import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { FileText, Play, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentTests() {
  const { profile } = useAuth()
  const [tests, setTests] = useState([])
  const [attempts, setAttempts] = useState({}) // testId -> result
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function fetchData() {
    setLoading(true)
    try {
      const [testRes, resRes] = await Promise.all([
        supabase.from('tests').select('*, questions(id)').order('created_at', { ascending: false }),
        supabase.from('results').select('test_id, score').eq('student_id', profile.id),
      ])

      setTests(testRes.data || [])

      const attMap = {}
      resRes.data?.forEach(r => { attMap[r.test_id] = r.score })
      setAttempts(attMap)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Available Tests" subtitle="Exams" />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Tests</h3>
        </div>
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : tests.length === 0 ? (
          <EmptyState message="No tests available yet" icon={FileText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Test Name</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, i) => {
                  const attempted = attempts[test.id] !== undefined
                  const score = attempts[test.id]
                  return (
                    <tr key={test.id}>
                      <td style={{ color: '#646464' }}>{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                               style={{ background: attempted ? '#e8f8f0' : '#e3f2fd' }}>
                            <FileText size={14} color={attempted ? '#3cb878' : '#3498db'} />
                          </div>
                          <span className="font-medium" style={{ color: '#042954' }}>{test.title}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{test.questions?.length || 0} Qs</span>
                      </td>
                      <td>
                        {attempted
                          ? <span className="badge badge-success">Completed</span>
                          : <span className="badge badge-warning">Pending</span>
                        }
                      </td>
                      <td>
                        {attempted
                          ? <span className="font-bold" style={{ color: '#042954' }}>{score}%</span>
                          : <span style={{ color: '#bbb' }}>—</span>
                        }
                      </td>
                      <td>
                        {attempted ? (
                          <span className="flex items-center gap-1 text-sm" style={{ color: '#3cb878' }}>
                            <CheckCircle size={14} /> Done
                          </span>
                        ) : (
                          <Link to={`/student/tests/${test.id}`}>
                            <button className="btn-primary flex items-center gap-1.5 py-1.5 px-4 text-xs">
                              <Play size={12} /> Start
                            </button>
                          </Link>
                        )}
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
