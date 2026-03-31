import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

// Generic fetch hook
export function useFetch(table, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from(table).select(options.select || '*')
      if (options.filter) query = query.eq(options.filter.column, options.filter.value)
      if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending ?? false })
      if (options.limit) query = query.limit(options.limit)

      const { data: result, error: err } = await query
      if (err) throw err
      setData(result || [])
    } catch (err) {
      setError(err.message)
      console.error(`Error fetching ${table}:`, err)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch, setData }
}

// Students hook
export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudents = useCallback(async (filters = {}) => {
    setLoading(true)
    try {
      let query = supabase
        .from('students')
        .select(`*, users(id, name, email, role)`)
        .order('created_at', { ascending: false })

      if (filters.department) query = query.eq('department', filters.department)
      if (filters.year) query = query.eq('year', filters.year)
      if (filters.search) {
        query = query.or(`register_no.ilike.%${filters.search}%`)
      }

      const { data, error: err } = await query
      if (err) throw err
      setStudents(data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  return { students, loading, error, fetchStudents }
}

// Teachers hook
export function useTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`*, users(id, name, email, role)`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeachers(data || [])
    } catch {
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTeachers() }, [fetchTeachers])

  return { teachers, loading, fetchTeachers }
}

// Attendance hook
export function useAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAttendance = useCallback(async (date, department, year) => {
    setLoading(true)
    try {
      let query = supabase
        .from('attendance')
        .select(`*, students(id, register_no, department, year, users(name))`)
        .eq('date', date)

      if (department) query = query.filter('students.department', 'eq', department)
      if (year) query = query.filter('students.year', 'eq', year)

      const { data, error } = await query
      if (error) throw error
      setAttendance(data || [])
    } catch {
      toast.error('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }, [])

  const markAttendance = async (records) => {
    try {
      // Upsert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'student_id,date' })

      if (error) throw error
      toast.success('Attendance saved successfully!')
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to save attendance')
      return false
    }
  }

  return { attendance, loading, fetchAttendance, markAttendance }
}

// Tests hook
export function useTests(teacherId = null) {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTests = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('tests')
        .select(`*, teachers(id, users(name)), questions(id)`)
        .order('created_at', { ascending: false })

      if (teacherId) query = query.eq('teacher_id', teacherId)

      const { data, error } = await query
      if (error) throw error
      setTests(data || [])
    } catch {
      toast.error('Failed to load tests')
    } finally {
      setLoading(false)
    }
  }, [teacherId])

  useEffect(() => { fetchTests() }, [fetchTests])

  const createTest = async (testData) => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .insert(testData)
        .select()
        .single()

      if (error) throw error
      toast.success('Test created successfully!')
      fetchTests()
      return data
    } catch (err) {
      toast.error(err.message || 'Failed to create test')
      return null
    }
  }

  return { tests, loading, fetchTests, createTest }
}

// Results hook
export function useResults(studentId = null, testId = null) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('results')
        .select(`*, students(id, register_no, users(name)), tests(id, title)`)
        .order('created_at', { ascending: false })

      if (studentId) query = query.eq('student_id', studentId)
      if (testId) query = query.eq('test_id', testId)

      const { data, error } = await query
      if (error) throw error
      setResults(data || [])
    } catch {
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }, [studentId, testId])

  useEffect(() => { fetchResults() }, [fetchResults])

  return { results, loading, fetchResults }
}
