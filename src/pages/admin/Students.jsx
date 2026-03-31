import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Download, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStudents } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState, Pagination, Modal } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const departments = ['', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']

export default function Students() {
  const { students, loading, fetchStudents } = useStudents()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const ROWS_PER_PAGE = 10

  async function handleDelete() {
    try {
      const { error } = await supabase.from('students').delete().eq('id', deleteModal.id)
      if (error) throw error
      toast.success('Student deleted')
      fetchStudents()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteModal({ open: false, id: null, name: '' })
    }
  }

  // Filter students
  const filtered = students.filter(s => {
    const name = s.users?.name?.toLowerCase() || ''
    const reg = s.register_no?.toLowerCase() || ''
    const matchSearch = !search || name.includes(search.toLowerCase()) || reg.includes(search.toLowerCase())
    const matchDept = !deptFilter || s.department === deptFilter
    const matchYear = !yearFilter || String(s.year) === yearFilter
    return matchSearch && matchDept && matchYear
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const deptColors = {
    'Computer Science': '#3498db',
    'Mathematics': '#3cb878',
    'Physics': '#ff9d01',
    'Chemistry': '#9b59b6',
    'Biology': '#ff636e',
    'English': '#1abc9c',
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Students" subtitle="All Students">
        <Link to="/admin/students/add">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Student
          </button>
        </Link>
      </PageHeader>

      <div className="card">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="form-label">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Name, register number..."
                className="form-input pl-9"
              />
            </div>
          </div>

          <div className="w-48">
            <label className="form-label">Department</label>
            <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1) }}
              className="form-input">
              <option value="">All Departments</option>
              {departments.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="w-32">
            <label className="form-label">Year</label>
            <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1) }}
              className="form-input">
              <option value="">All Years</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>

          <button
            onClick={() => { setSearch(''); setDeptFilter(''); setYearFilter('') }}
            className="btn-navy"
          >
            Reset
          </button>
        </div>

        {/* Summary */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between text-sm"
             style={{ color: '#646464' }}>
          <span>
            Showing <strong style={{ color: '#042954' }}>{paginated.length}</strong> of{' '}
            <strong style={{ color: '#042954' }}>{filtered.length}</strong> students
          </span>
          <button className="flex items-center gap-1.5 text-xs" style={{ color: '#3498db' }}>
            <Download size={13} /> Export
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No students found" icon={GraduationCap} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Register No</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: deptColors[student.department] || '#3498db' }}
                      >
                        {student.users?.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium" style={{ color: '#042954' }}>
                        {student.users?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="font-mono text-xs">{student.register_no || '—'}</td>
                    <td>
                      {student.department && (
                        <span className="badge badge-info">{student.department}</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-navy">Year {student.year}</span>
                    </td>
                    <td style={{ color: '#646464', fontSize: '12px' }}>
                      {student.users?.email || '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/students/${student.id}`}>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                                  style={{ color: '#3498db' }}>
                            <Eye size={14} />
                          </button>
                        </Link>
                        <Link to={`/admin/students/edit/${student.id}`}>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-yellow-50"
                                  style={{ color: '#ffae01' }}>
                            <Edit size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: student.id, name: student.users?.name })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                          style={{ color: '#ff636e' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 pb-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal open={deleteModal.open} title="Delete Student" onClose={() => setDeleteModal({ open: false })}>
        <p className="text-sm mb-6" style={{ color: '#646464' }}>
          Are you sure you want to delete <strong style={{ color: '#042954' }}>{deleteModal.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button className="btn-navy" onClick={() => setDeleteModal({ open: false })}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}
