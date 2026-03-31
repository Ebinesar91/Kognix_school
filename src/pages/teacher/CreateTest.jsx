import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, PlusCircle } from 'lucide-react'
import { PageHeader } from '../../components/UI'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const emptyQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correct_answer: 0,
})

export default function CreateTest() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [loading, setLoading] = useState(false)

  function addQuestion() {
    setQuestions(prev => [...prev, emptyQuestion()])
  }

  function removeQuestion(idx) {
    if (questions.length === 1) return toast.error('At least one question required')
    setQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  function updateQuestion(idx, field, value) {
    setQuestions(prev => prev.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    ))
  }

  function updateOption(qIdx, optIdx, value) {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx ? {
        ...q,
        options: q.options.map((o, j) => j === optIdx ? value : o)
      } : q
    ))
  }

  function validate() {
    if (!title.trim()) { toast.error('Test title is required'); return false }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} text is required`); return false
      }
      const emptyOpts = q.options.filter(o => !o.trim())
      if (emptyOpts.length > 0) {
        toast.error(`All 4 options required for question ${i + 1}`); return false
      }
    }
    return true
  }

  async function handleSave() {
    if (!validate()) return
    setLoading(true)
    try {
      // Create the test
      const { data: testData, error: testErr } = await supabase
        .from('tests')
        .insert({ title, teacher_id: profile?.id })
        .select()
        .single()

      if (testErr) throw testErr

      // Insert all questions
      const questionRecords = questions.map(q => ({
        test_id: testData.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
      }))

      const { error: qErr } = await supabase.from('questions').insert(questionRecords)
      if (qErr) throw qErr

      toast.success(`Test "${title}" created with ${questions.length} questions!`)
      navigate('/teacher/tests')
    } catch (err) {
      toast.error(err.message || 'Failed to create test')
    } finally {
      setLoading(false)
    }
  }

  const letters = ['A', 'B', 'C', 'D']
  const optionColors = ['#3498db', '#3cb878', '#ff9d01', '#9b59b6']

  return (
    <div className="animate-fade-in">
      <PageHeader title="Create Test" subtitle="Tests">
        <button onClick={() => navigate(-1)} className="btn-navy flex items-center gap-2">
          <ArrowLeft size={15} /> Back
        </button>
      </PageHeader>

      {/* Test Title */}
      <div className="card mb-5">
        <div className="card-header">
          <h3 className="card-title">Test Details</h3>
        </div>
        <div className="card-body">
          <label className="form-label">Test Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Mathematics Chapter 5 Quiz"
            className="form-input max-w-lg"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-5">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="card animate-fade-in">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: '#ffae01' }}>
                  {qIdx + 1}
                </div>
                <span className="card-title">Question {qIdx + 1}</span>
              </div>
              <button
                onClick={() => removeQuestion(qIdx)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                style={{ color: '#ff636e' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="card-body space-y-4">
              {/* Question text */}
              <div>
                <label className="form-label">Question *</label>
                <textarea
                  value={q.question}
                  onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                  placeholder="Enter your question here..."
                  rows={2}
                  className="form-input resize-none"
                />
              </div>

              {/* Options */}
              <div>
                <label className="form-label">Options (click radio to set correct answer)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        q.correct_answer === optIdx
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateQuestion(qIdx, 'correct_answer', optIdx)}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: optionColors[optIdx] }}
                      >
                        {letters[optIdx]}
                      </div>
                      <input
                        value={opt}
                        onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${letters[optIdx]}`}
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                        style={{ color: '#042954' }}
                        onClick={e => e.stopPropagation()}
                      />
                      {q.correct_answer === optIdx && (
                        <span className="text-green-500 text-xs font-bold flex-shrink-0">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question + Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 border-dashed"
          style={{ borderColor: '#ffae01', color: '#ffae01' }}
        >
          <PlusCircle size={16} /> Add Question
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: '#646464' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </span>
          <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : null
            }
            {loading ? 'Saving...' : 'Save Test'}
          </button>
        </div>
      </div>
    </div>
  )
}
