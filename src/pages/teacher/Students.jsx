import { useStudents } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState } from '../../components/UI'
import { GraduationCap } from 'lucide-react'

export default function TeacherStudents() {
  const { students, loading } = useStudents()

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Students" subtitle="Students" />
      <div className="card">
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : students.length === 0 ? (
          <EmptyState message="No students found" icon={GraduationCap} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Register No</th>
                  <th>Department</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                           style={{ background: '#3498db' }}>
                        {student.users?.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                    </td>
                    <td className="font-medium" style={{ color: '#042954' }}>{student.users?.name}</td>
                    <td className="font-mono text-xs">{student.register_no}</td>
                    <td><span className="badge badge-info">{student.department}</span></td>
                    <td><span className="badge badge-navy">Year {student.year}</span></td>
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
