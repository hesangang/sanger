import { useEffect } from 'react'

export interface ToastItem {
  id: number
  message: string
  type?: 'success' | 'info' | 'warn'
}

interface ToastProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed z-[100] bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 1800)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const accentBg = toast.type === 'warn'
    ? 'linear-gradient(135deg, #fcd34d, #f59e0b)'
    : 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))'

  return (
    <div
      className="pointer-events-auto flex items-center gap-2 pr-3 pl-2 py-2 rounded-lg border shadow-lg backdrop-blur-sm animate-[slide-in_0.18s_ease-out]"
      style={{
        minWidth: '200px',
        backgroundColor: 'color-mix(in srgb, var(--t-card) 96%, transparent)',
        borderColor: 'var(--t-border-sub)',
        color: 'var(--t-text-main)',
      }}
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: accentBg, color: '#fff' }}
      >
        {toast.type === 'warn' ? '!' : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </div>
      <span className="text-[11px] font-medium pr-1 whitespace-nowrap leading-none">{toast.message}</span>
    </div>
  )
}
