import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#f0f1f3' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Navbar sidebarCollapsed={collapsed} onSidebarToggle={() => setCollapsed(!collapsed)} />

      <main
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? '64px' : '260px',
          marginTop: '70px',
          minHeight: 'calc(100vh - 70px)',
          padding: '24px',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
