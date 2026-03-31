import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  Calendar, FileText, Bell, ChevronDown, ChevronRight, School,
  BarChart2, MessageSquare, Settings, LogOut, BookMarked
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const adminMenu = [
  {
    label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard'
  },
  {
    label: 'Students', icon: GraduationCap, children: [
      { label: 'All Students', path: '/admin/students' },
      { label: 'Add Student', path: '/admin/students/add' },
    ]
  },
  {
    label: 'Teachers', icon: Users, children: [
      { label: 'All Teachers', path: '/admin/teachers' },
      { label: 'Add Teacher', path: '/admin/teachers/add' },
    ]
  },
  {
    label: 'Attendance', icon: ClipboardList, path: '/admin/attendance'
  },
  {
    label: 'Exams', icon: FileText, children: [
      { label: 'All Tests', path: '/admin/tests' },
      { label: 'Results', path: '/admin/results' },
    ]
  },
  {
    label: 'Reports', icon: BarChart2, path: '/admin/reports'
  },
]

const teacherMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
  { label: 'Students', icon: GraduationCap, path: '/teacher/students' },
  { label: 'Attendance', icon: ClipboardList, path: '/teacher/attendance' },
  {
    label: 'Tests', icon: FileText, children: [
      { label: 'My Tests', path: '/teacher/tests' },
      { label: 'Create Test', path: '/teacher/tests/create' },
    ]
  },
  { label: 'Materials', icon: BookMarked, path: '/teacher/materials' },
  { label: 'Results', icon: BarChart2, path: '/teacher/results' },
]

const studentMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { label: 'My Attendance', icon: ClipboardList, path: '/student/attendance' },
  { label: 'Exams', icon: FileText, path: '/student/tests' },
  { label: 'My Results', icon: BarChart2, path: '/student/results' },
  { label: 'Materials', icon: BookMarked, path: '/student/materials' },
]

function MenuItem({ item, collapsed }) {
  const location = useLocation()
  const [open, setOpen] = useState(() =>
    item.children?.some(c => location.pathname.startsWith(c.path)) || false
  )

  if (item.children) {
    const isActive = item.children.some(c => location.pathname.startsWith(c.path))
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className={`sidebar-link ${isActive ? 'active' : ''}`}
        >
          <item.icon size={18} />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {!collapsed && (
            <span className="ml-auto">
              {open
                ? <ChevronDown size={14} />
                : <ChevronRight size={14} />
              }
            </span>
          )}
        </div>
        {open && !collapsed && (
          <div className="bg-black/10">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `sidebar-submenu-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    >
      <item.icon size={18} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

export default function Sidebar({ collapsed }) {
  const { profile, signOut } = useAuth()
  const role = profile?.role || 'student'

  const menu = role === 'admin' ? adminMenu
    : role === 'teacher' ? teacherMenu
    : studentMenu

  return (
    <aside
      className="fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? '64px' : '260px',
        background: '#0B213F',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10"
           style={{ minHeight: '70px' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: '#0B213F' }}>
          <svg viewBox="0 0 100 100" className="w-8 h-8">
            <circle cx="50" cy="30" r="12" fill="#F17A28" />
            <path d="M35 80 V40 M35 60 L65 40 M35 60 L65 80" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-lg tracking-wider">KOGNIX</div>
            <div className="text-white/50 text-[10px] uppercase font-semibold">Smart School Management</div>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                 style={{ background: '#F17A28' }}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-white text-sm font-medium truncate max-w-[140px]">
                {profile?.name || 'User'}
              </div>
              <div className="text-white/50 text-xs capitalize">{role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {!collapsed && (
          <div className="px-4 py-2 text-white/30 text-xs font-semibold uppercase tracking-wider">
            Main Menu
          </div>
        )}
        {menu.map((item, i) => (
          <MenuItem key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-white/10 p-2">
        <button
          onClick={signOut}
          className="sidebar-link w-full"
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
