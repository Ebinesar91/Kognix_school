import { PageHeader } from '../components/UI'
import { BookOpen, Download } from 'lucide-react'

export default function Materials({ role = 'student' }) {
  const materials = [
    { title: 'Mathematics Chapter 5', subject: 'Math', type: 'PDF', size: '2.4 MB' },
    { title: 'Physics Laws of Motion', subject: 'Physics', type: 'PDF', size: '1.8 MB' },
    { title: 'Chemistry Organics', subject: 'Chemistry', type: 'DOCX', size: '1.2 MB' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Study Materials" subtitle="Materials" />

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="card-title">Available Materials</h3>
          {role === 'teacher' && (
            <button className="btn-primary text-sm px-4 py-2">Upload Material</button>
          )}
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat, i) => (
            <div key={i} className="border rounded-xl p-4 flex items-start gap-3 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-[#042954] line-clamp-1">{mat.title}</h4>
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{mat.subject}</span>
                  <span>{mat.size}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
