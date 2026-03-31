import { useState } from 'react'
import { Search, Bell, Mail, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar({ sidebarCollapsed, onSidebarToggle }) {
  const { profile } = useAuth()
  const [searchVal, setSearchVal] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center px-6 bg-white shadow-sm"
      style={{
        left: sidebarCollapsed ? '64px' : '260px',
        height: '70px',
        transition: 'left 0.3s',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onSidebarToggle}
        className="mr-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {sidebarCollapsed ? <Menu size={20} color="#042954" /> : <X size={20} color="#042954" />}
      </button>

      {/* Search */}
      <div className="search-bar flex-1 max-w-sm">
        <Search size={16} color="#aaa" />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Find Something . . ."
        />
      </div>

      <div className="flex-1" />

      {/* Right side icons */}
      <div className="flex items-center gap-4">
        {/* Mail */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Mail size={20} color="#646464" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: '#ffae01' }}>
            5
          </span>
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={20} color="#646464" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            8
          </span>
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-800">
                {profile?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {profile?.role || 'Student'}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: '#042954' }}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <ChevronDown size={14} color="#646464" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-800">{profile?.name}</div>
                <div className="text-xs text-gray-500">{profile?.email}</div>
              </div>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
