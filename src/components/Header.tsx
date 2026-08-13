import { useState, useEffect } from 'react'
import type { AccentKey, Mode } from '../App'

interface HeaderProps {
  search: string
  setSearch: (v: string) => void
  mode: Mode
  onToggleMode: () => void
  accent: AccentKey
  onChangeAccent: (a: AccentKey) => void
}

const ACCENTS: { key: AccentKey; label: string; swatch: string }[] = [
  { key: 'blue',    label: '浅蓝', swatch: 'linear-gradient(135deg,#7dd3fc,#0284c7)' },
  { key: 'violet',  label: '浅青', swatch: 'linear-gradient(135deg,#67e8f9,#0891b2)' },
  { key: 'emerald', label: '浅绿', swatch: 'linear-gradient(135deg,#6ee7b7,#059669)' },
  { key: 'amber',   label: '浅橙', swatch: 'linear-gradient(135deg,#fdba74,#ea580c)' },
  { key: 'rose',    label: '浅红', swatch: 'linear-gradient(135deg,#fda4af,#e11d48)' },
]

export type ViewMode = 'overview' | 'favorites' | 'recent'

export default function Header({
  search, setSearch, mode, onToggleMode, accent, onChangeAccent,
}: HeaderProps) {
  const [showAccents, setShowAccents] = useState(false)

  useEffect(() => {
    if (!showAccents) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAccents(false)
    }
    const onScroll = () => setShowAccents(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [showAccents])

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--t-card) 88%, transparent)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-2.5 lg:px-5">
        <div className="flex items-center justify-between h-10 gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="rounded-md flex items-center justify-center shadow-sm flex-shrink-0"
              style={{
                width: '26px', height: '26px',
                background: 'linear-gradient(135deg, var(--t-accent-500), var(--t-accent-700))',
              }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h4v4H4zM14 6h4v4h-4zM4 16h4v4H4zM14 16h4v4h-4z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <HeaderActions
              search={search} setSearch={setSearch}
              mode={mode} onToggleMode={onToggleMode}
              accent={accent} onChangeAccent={onChangeAccent}
              showAccents={showAccents} setShowAccents={setShowAccents}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

function HeaderActions({
  search, setSearch, mode, onToggleMode, accent, onChangeAccent, showAccents, setShowAccents,
}: {
  search: string
  setSearch: (v: string) => void
  mode: Mode
  onToggleMode: () => void
  accent: AccentKey
  onChangeAccent: (a: AccentKey) => void
  showAccents: boolean
  setShowAccents: (v: boolean) => void
}) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none" style={{ color: 'var(--t-text-mute)' }}>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={search ? '' : '搜索…'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-6 pr-2 py-1 text-[11px] border rounded focus:outline-none focus:ring-2 transition-all w-36 sm:w-44 md:w-52 lg:w-64"
          style={{
            backgroundColor: 'var(--t-border-sub)',
            borderColor: 'var(--t-border-sub)',
            color: 'var(--t-text-main)',
            // @ts-ignore
            '--tw-ring-color': 'var(--t-accent-500)',
          } as React.CSSProperties}
          onFocus={(e) => { e.currentTarget.style.backgroundColor = 'var(--t-card)'; e.currentTarget.style.borderColor = 'transparent' }}
          onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--t-border-sub)'; e.currentTarget.style.borderColor = 'var(--t-border-sub)' }}
          aria-label="搜索系统"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setShowAccents(!showAccents)}
          className="rounded border flex items-center justify-center transition-colors hover:opacity-90 flex-shrink-0"
          style={{
            width: '24px', height: '24px',
            background: ACCENTS.find(a => a.key === accent)?.swatch,
            borderColor: 'var(--t-border-main)',
          }}
          title="主题色"
          aria-label="切换主题色"
          aria-expanded={showAccents}
          aria-haspopup="listbox"
        />
        {showAccents && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAccents(false)} aria-hidden />
            <div
              role="listbox"
              className="absolute right-0 top-8 z-50 rounded-lg border shadow-lg p-2 flex gap-1.5"
              style={{ backgroundColor: 'var(--t-card)', borderColor: 'var(--t-border-sub)' }}
            >
              {ACCENTS.map(a => (
                <button
                  key={a.key}
                  role="option"
                  aria-selected={accent === a.key}
                  onClick={() => { onChangeAccent(a.key); setShowAccents(false) }}
                  className="w-7 h-7 rounded-md border-2 transition-transform hover:scale-110"
                  title={a.label}
                  aria-label={a.label}
                  style={{
                    background: a.swatch,
                    borderColor: accent === a.key ? 'var(--t-text-main)' : 'transparent',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={onToggleMode}
        className="rounded border flex items-center justify-center transition-colors flex-shrink-0"
        style={{
          width: '24px', height: '24px',
          color: 'var(--t-text-sub)',
          borderColor: 'var(--t-border-main)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--t-border-sub)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title={mode === 'dark' ? '切换亮色' : '切换暗色'}
        aria-label={mode === 'dark' ? '切换亮色模式' : '切换暗色模式'}
        aria-pressed={mode === 'dark'}
      >
        {mode === 'dark' ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.654l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="hidden sm:flex items-center gap-1 pl-1 border-l ml-0.5 flex-shrink-0" style={{ borderColor: 'var(--t-border-sub)' }}>
        <div
          className="rounded-full flex items-center justify-center text-white text-[9px] font-semibold shadow-sm"
          style={{
            width: '24px', height: '24px',
            background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))',
          }}
          title="管理员"
        >
          管
        </div>
      </div>
    </>
  )
}
