import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/UI'
import toast from 'react-hot-toast'

const letters = ['A', 'B', 'C', 'D']
const optionColors = ['#3498db', '#3cb878', '#ff9d01', '#9b59b6']

export default function AttemptTest() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({}) // { questionId: selectedIdx }
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [alreadyAttempted, setAlreadyAttempted] = useState(false)

  useEffect(() => {
    if (testId && profile) {
      loadTest()
      checkAlreadyAttempted()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, profile])

  async function loadTest() {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*, questions(*)')
        .eq('id', testId)
        .single()

      if (error) throw error
      setTest(data)
      setQuestions(data.questions || [])
    } catch {
      toast.error('Failed to load test')
    } finally {
      setLoading(false)
    }
  }

  async function checkAlreadyAttempted() {
    try {
      const { data } = await supabase
        .from('results')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', profile.id)
        .single()

      if (data) {
        setAlreadyAttempted(true)
        setResult(data)
      }
    } catch {
      /* ignored */
    }
  }

  function selectAnswer(questionId, optionIdx) {
    if (submitted || alreadyAttempted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }))
  }

  async function handleSubmit() {
    const unanswered = questions.filter(q => answers[q.id] === undefined).length
    if (unanswered > 0) {
      return toast.error(`Please answer all questions (${unanswered} remaining)`)
    }

    setSubmitting(true)
    try {
      // Calculate score
      let score = 0
      questions.forEach(q => {
        if (answers[q.id] === q.correct_answer) score++
      })

      const finalScore = Math.round((score / questions.length) * 100)

      // Save result
      const { error } = await supabase
        .from('results')
        .insert({
          student_id: profile.id,
          test_id: testId,
          score: finalScore,
        })
        .select()
        .single()

      if (error) throw error

      setResult({ score: finalScore, correct: score, total: questions.length })
      setSubmitted(true)
      toast.success(`Test submitted! Score: ${finalScore}%`)
    } catch (err) {
      toast.error(err.message || 'Failed to submit test')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size={48} />
      </div>
    )
  }

  if (!test) {
    return <div className="text-center py-16 text-gray-500">Test not found</div>
  }

  // Result screen
  if (submitted || (alreadyAttempted && result)) {
    const score = result?.score || 0
    const correct = result?.correct || Math.round((score / 100) * questions.length)
    const total = questions.length

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center p-12">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}
               style={{ background: score >= 60 ? '#e8f8f0' : '#ffe8e9' }}>
            {score >= 60
              ? <CheckCircle size={48} color="#3cb878" />
              : <XCircle size={48} color="#ff636e" />
            }
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#042954' }}>
            {alreadyAttempted ? 'Already Attempted' : 'Test Complete!'}
          </h2>
          <p className="mb-8" style={{ color: '#646464' }}>
            {test.title}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl" style={{ background: '#e3f2fd' }}>
              <div className="text-3xl font-bold" style={{ color: '#3498db' }}>{score}%</div>
              <div className="text-xs mt-1" style={{ color: '#646464' }}>Your Score</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#e8f8f0' }}>
              <div className="text-3xl font-bold" style={{ color: '#3cb878' }}>{correct}</div>
              <div className="text-xs mt-1" style={{ color: '#646464' }}>Correct</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#ffe8e9' }}>
              <div className="text-3xl font-bold" style={{ color: '#ff636e' }}>{total - correct}</div>
              <div className="text-xs mt-1" style={{ color: '#646464' }}>Wrong</div>
            </div>
          </div>

          <div className="w-full rounded-full h-3 mb-6" style={{ background: '#f0f1f3' }}>
            <div
              className="h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${score}%`,
                background: score >= 60 ? '#3cb878' : '#ff636e'
              }}
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/student/results')} className="btn-primary">
              View All Results
            </button>
            <button onClick={() => navigate('/student/tests')} className="btn-navy">
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card mb-5">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#042954' }}>{test.title}</h1>
              <p className="text-sm mt-1" style={{ color: '#646464' }}>
                Answer all questions and click Submit
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: '#ffae01' }}>
                {answeredCount}/{questions.length}
              </div>
              <div className="text-xs" style={{ color: '#646464' }}>Answered</div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 w-full rounded-full h-2" style={{ background: '#f0f1f3' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
                background: '#ffae01'
              }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5 mb-5">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: answers[q.id] !== undefined ? '#ffae01' : '#e1e1e1',
                              color: answers[q.id] !== undefined ? 'white' : '#646464' }}>
                  {qIdx + 1}
                </div>
                <span className="font-semibold text-sm" style={{ color: '#042954' }}>{q.question}</span>
              </div>
              {answers[q.id] !== undefined && (
                <CheckCircle size={16} color="#3cb878" />
              )}
            </div>
            <div className="card-body space-y-2">
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  onClick={() => selectAnswer(q.id, optIdx)}
                  className={`mcq-option ${answers[q.id] === optIdx ? 'selected' : ''}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: answers[q.id] === optIdx ? '#ffae01' : optionColors[optIdx] }}
                  >
                    {letters[optIdx]}
                  </div>
                  <span className="text-sm" style={{ color: '#042954' }}>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="card p-6 flex items-center justify-between">
        <div>
          {answeredCount < questions.length && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#ff9d01' }}>
              <AlertCircle size={15} />
              {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} remaining
            </div>
          )}
          {answeredCount === questions.length && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#3cb878' }}>
              <CheckCircle size={15} />
              All questions answered!
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex items-center gap-2"
        >
          {submitting
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : null
          }
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </div>
  )
}
