/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
        localStorage.setItem('userRole', data.role)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Pre-fetch role for immediate redirection in Login
    if (data.user) {
      const { data: profileData } = await supabase.from('users').select('role').eq('id', data.user.id).single()
      if (profileData) {
        localStorage.setItem('userRole', profileData.role)
        return { ...data, role: profileData.role }
      }
    }
    return data
  }

  async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      // Insert into users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        name: userData.name,
        email: email,
        role: userData.role || 'student',
      })
      if (profileError) throw profileError

      // If student, insert student record
      if (userData.role === 'student' || !userData.role) {
        await supabase.from('students').insert({
          id: data.user.id,
          register_no: userData.register_no || '',
          department: userData.department || '',
          year: userData.year || 1,
        })
      }
    }
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
    setUser(null)
    localStorage.removeItem('userRole')
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = { user, profile, loading, signIn, signUp, signOut, resetPassword, fetchProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
