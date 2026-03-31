import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTeachers } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState, Pagination, Modal } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History']

export default function Teachers() {
  const { teachers, loading, fetchTeachers } = useTeachers()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const ROWS = 10

  async function handleDelete() {
    try {
      await supabase.from('teachers').delete().eq('id', deleteModal.id)
      toast.success('Teacher deleted')
      fetchTeachers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteModal({ open: false })
    }
  }

  const filtered = teachers.filter(t => {
    const name = t.users?.name?.toLowerCase() || ''
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchDept = !deptFilter || t.department === deptFilter
    return matchSearch && matchDept
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS))
  const paginated = filtered.slice((page - 1) * ROWS, page * ROWS)

  const colors = ['#3498db', '#3cb878', '#ff9d01', '#9b59b6', '#ff636e', '#1abc9c', '#e74c3c']

  return (
    <div className="animate-fade-in">
      <PageHeader title="Teachers" subtitle="All Teachers">
        <Link to="/admin/teachers/add">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Teacher
          </button>
        </Link>
      </PageHeader>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="form-label">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Teacher name..." className="form-input pl-9" />
            </div>
          </div>
          <div className="w-48">
            <label className="form-label">Department</label>
            <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1) }}
              className="form-input">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={() => { setSearch(''); setDeptFilter('') }} className="btn-navy">Reset</button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 text-sm" style={{ color: '#646464' }}>
          <span>Total: <strong style={{ color: '#042954' }}>{filtered.length}</strong> teachers</span>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No teachers found" icon={Users} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((teacher, i) => (
                  <tr key={teacher.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                           style={{ background: colors[i % colors.length] }}>
                        {teacher.users?.name?.[0]?.toUpperCase() || 'T'}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium" style={{ color: '#042954' }}>
                        {teacher.users?.name || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#646464' }}>{teacher.users?.email}</td>
                    <td>
                      {teacher.department && (
                        <span className="badge badge-info">{teacher.department}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"
                                style={{ color: '#3498db' }}>
                          <Eye size={14} />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-yellow-50"
                                style={{ color: '#ffae01' }}>
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: teacher.id, name: teacher.users?.name })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
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

        {!loading && filtered.length > 0 && (
          <div className="px-5 pb-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      <Modal open={deleteModal.open} title="Delete Teacher" onClose={() => setDeleteModal({ open: false })}>
        <p className="text-sm mb-6" style={{ color: '#646464' }}>
          Are you sure you want to delete <strong style={{ color: '#042954' }}>{deleteModal.name}</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <button className="btn-navy" onClick={() => setDeleteModal({ open: false })}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}
