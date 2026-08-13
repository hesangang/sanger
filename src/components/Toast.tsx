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
    <div className="fixed z-[100] bottom-5 right-5 sm:bottom-6 sm:right-6 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 2200)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const gradient =
    toast.type === 'warn'   ? 'linear-gradient(135deg, #FCD34D, #F59E0B)' :
    toast.type === 'info'   ? 'linear-gradient(135deg, #60A5FA, #2563EB)' :
                              'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))'

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-3.5 py-3 rounded-2xl border shadow-2xl animate-[slide-in_0.18s_ease-out]"
      style={{
        minWidth: '240px',
        backgroundColor: 'var(--t-card)',
        borderColor: 'var(--t-border-main)',
        color: 'var(--t-text-main)',
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
        style={{ background: gradient, color: '#fff' }}
      >
        {toast.type === 'warn' ? (
          <span className="text-base font-bold leading-none">!</span>
        ) : toast.type === 'info' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.2l-3.5-3.6L4 14l5 5 11-11-1.4-1.4L9 16.2z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] font-medium block truncate leading-tight">{toast.message}</span>
      </div>
    </div>
  )
}
