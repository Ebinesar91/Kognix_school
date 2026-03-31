import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Materials from './pages/Materials'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AddStudent from './pages/admin/AddStudent'
import AdminTeachers from './pages/admin/Teachers'
import AddTeacher from './pages/admin/AddTeacher'
import AdminAttendance from './pages/admin/Attendance'
import AdminTests from './pages/admin/Tests'
import AdminResults from './pages/admin/Results'
import AdminReports from './pages/admin/Reports'

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherStudents from './pages/teacher/Students'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherTests from './pages/teacher/Tests'
import CreateTest from './pages/teacher/CreateTest'
import TeacherResults from './pages/teacher/Results'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentTests from './pages/student/Tests'
import AttemptTest from './pages/student/AttemptTest'
import StudentResults from './pages/student/Results'

// Auto-redirect based on role
function RoleRedirect() {
  // This is handled by ProtectedRoute + auth context
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
            success: { style: { borderLeft: '4px solid #3cb878' } },
            error: { style: { borderLeft: '4px solid #ff636e' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="teachers/add" element={<AddTeacher />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="tests" element={<TeacherTests />} />
            <Route path="tests/create" element={<CreateTest />} />
            <Route path="materials" element={<Materials role="teacher" />} />
            <Route path="results" element={<TeacherResults />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="tests" element={<StudentTests />} />
            <Route path="tests/:testId" element={<AttemptTest />} />
            <Route path="materials" element={<Materials role="student" />} />
            <Route path="results" element={<StudentResults />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
