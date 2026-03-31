// Skeleton loader component
export function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '16px' }}
    />
  )
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton width="64px" height="64px" className="rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height="12px" />
        <Skeleton width="40%" height="24px" />
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} width={`${100 / cols}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loading spinner
export function Spinner({ size = 24, color = '#F17A28' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  )
}

// Empty state
export function EmptyState({ message = 'No data found', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      {Icon && <Icon size={48} className="mb-4 opacity-30" />}
      <p className="text-sm">{message}</p>
    </div>
  )
}

// Page header
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0B213F' }}>{title}</h1>
          {subtitle && (
            <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: '#646464' }}>
              <span>Home</span>
              <span>›</span>
              <span style={{ color: '#F17A28' }}>{subtitle}</span>
            </div>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}

// Stat card
// eslint-disable-next-line no-unused-vars
export function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="stat-icon" style={{ background: bgColor || '#e8f8f0' }}>
        <Icon size={28} color={color || '#3cb878'} />
      </div>
      <div>
        <div className="text-sm font-medium" style={{ color: '#646464' }}>{title}</div>
        <div className="text-2xl font-bold mt-0.5" style={{ color: '#0B213F' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </div>
    </div>
  )
}

// Confirmation modal
export function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg" style={{ color: '#042954' }}>{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Pagination
export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2 mt-4 justify-end">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="page-btn disabled:opacity-40"
      >
        ‹
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`page-btn ${p === page ? 'active' : ''}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="page-btn disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}

// Search + filter bar
export function FilterBar({ children }) {
  return (
    <div className="flex flex-wrap gap-3 items-end p-4 border-b border-gray-100">
      {children}
    </div>
  )
}
