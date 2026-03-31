import { useState } from 'react'
import { Plus, Search, FileText, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTests } from '../../hooks/useData'
import { PageHeader, TableSkeleton, EmptyState, Modal } from '../../components/UI'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

export default function Tests() {
  const { tests, loading, fetchTests } = useTests()
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' })

  async function handleDelete() {
    try {
      await supabase.from('tests').delete().eq('id', deleteModal.id)
      toast.success('Test deleted')
      fetchTests()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteModal({ open: false })
    }
  }

  const filtered = tests.filter(t =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <PageHeader title="Tests & Exams" subtitle="Tests">
        <Link to="/admin/tests/create">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Test
          </button>
        </Link>
      </PageHeader>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex gap-3">
          <div className="flex-1 max-w-sm relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tests..." className="form-input pl-9" />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No tests found" icon={FileText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Test Title</th>
                  <th>Teacher</th>
                  <th>Questions</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((test, i) => (
                  <tr key={test.id}>
                    <td style={{ color: '#646464' }}>{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                             style={{ background: '#e3f2fd' }}>
                          <FileText size={14} color="#3498db" />
                        </div>
                        <span className="font-medium" style={{ color: '#042954' }}>{test.title}</span>
                      </div>
                    </td>
                    <td style={{ color: '#646464' }}>
                      {test.teachers?.users?.name || 'N/A'}
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {test.questions?.length || 0} Qs
                      </span>
                    </td>
                    <td style={{ color: '#646464', fontSize: '12px' }}>
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/tests/${test.id}`}>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"
                                  style={{ color: '#3498db' }}>
                            <Eye size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: test.id, title: test.title })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                          style={{ color: '#ff636e' }}>
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
      </div>

      <Modal open={deleteModal.open} title="Delete Test" onClose={() => setDeleteModal({ open: false })}>
        <p className="text-sm mb-6" style={{ color: '#646464' }}>
          Delete test <strong style={{ color: '#042954' }}>{deleteModal.title}</strong>? All questions and results will be lost.
        </p>
        <div className="flex gap-3 justify-end">
          <button className="btn-navy" onClick={() => setDeleteModal({ open: false })}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}
