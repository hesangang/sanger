import type { AccentKey } from '../data/Mine'
import { ACCENTS } from '../data/Mine'
import {
  CURRENT_USER, MINE_MESSAGE_CENTER, MINE_THEME_ABOUT, LOGOUT_MENU,
} from '../data/Mine'

type Mode = 'light' | 'dark'

interface MineProps {
  mode: Mode
  onToggleMode: () => void
  accent: AccentKey
  onChangeAccent: (a: AccentKey) => void
}

const tintStyle = (tint: 'accent' | 'ok') => {
  if (tint === 'ok') {
    return {
      backgroundColor: 'color-mix(in srgb, var(--t-status-ok) 18%, transparent)',
      color: 'var(--t-status-ok)',
    }
  }
  return {
    backgroundColor: 'color-mix(in srgb, var(--t-accent-400) 18%, transparent)',
    color: 'var(--t-accent-600)',
  }
}

const messageSvg = (icon: string) => {
  switch (icon) {
    case '🔔':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
        </svg>
      )
    case '🛡':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case '👥':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    default:
      return <span className="text-[16px]">{icon}</span>
  }
}

export default function Mine({
  mode,
  onToggleMode,
  accent,
  onChangeAccent,
}: MineProps) {
  return (
    <div className="space-y-5">
      <section
        className="rounded-2xl border p-5 shadow-sm overflow-hidden relative"
        style={{
          borderColor: 'var(--t-border-sub)',
          backgroundColor: 'var(--t-card)',
          backgroundImage: 'radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--t-accent-500) 20%, transparent), transparent 50%)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))',
              boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)`,
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 20%, #fff, transparent 50%)' }} />
            <span className="relative text-white font-black text-[26px] leading-none select-none">{CURRENT_USER.avatarChar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold truncate" style={{ color: 'var(--t-text-main)' }}>
                {CURRENT_USER.displayName}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{
                background: 'linear-gradient(135deg, var(--t-accent-500), var(--t-accent-700))',
                color: '#fff',
              }}>
                {CURRENT_USER.badgeLabel}
              </span>
            </div>
            <p className="text-sm truncate" style={{ color: 'var(--t-text-sub)' }}>
              {CURRENT_USER.org}
            </p>
          </div>
          <button
            className="flex-shrink-0 h-9 px-3 rounded-xl text-xs font-semibold transition-all"
            style={{
              color: 'var(--t-status-error)',
              backgroundColor: 'color-mix(in srgb, var(--t-status-error) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--t-status-error) 25%, transparent)',
            }}
            title={LOGOUT_MENU.label}
          >
            退出
          </button>
        </div>
      </section>

      <section
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
      >
        <h3 className="text-[11px] font-semibold tracking-wider uppercase px-4 pt-3 pb-2" style={{ color: 'var(--t-text-mute)' }}>
          消息中心
        </h3>
        <ul style={{ borderColor: 'var(--t-border-sub)' }}>
          {MINE_MESSAGE_CENTER.map((item, idx) => (
            <li key={`${item.title}-${idx}`}>
              <button className="w-full flex items-center gap-3 p-4 text-left transition-colors active:bg-[var(--t-bg)]">
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={tintStyle(item.tint)}>
                  {messageSvg(item.icon)}
                  {item.title === '系统通知' && CURRENT_USER.unreadNotice ? (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--t-status-error)' }} />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>{item.title}</p>
                    {item.countLabel && (
                      <span className="text-[10px]" style={{ color: 'var(--t-text-mute)' }}>{item.countLabel}</span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--t-text-mute)' }}>{item.summary}</p>
                </div>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--t-text-mute)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
      >
        <h3 className="text-[11px] font-semibold tracking-wider uppercase px-4 pt-3 pb-2" style={{ color: 'var(--t-text-mute)' }}>
          外观与显示
        </h3>
        <ul
          className="divide-y"
          style={{ borderColor: 'var(--t-border-sub)' } as React.CSSProperties}
        >
          <li className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: 'color-mix(in srgb, var(--t-accent-400) 18%, transparent)',
                color: 'var(--t-accent-600)',
              }}>
                {mode === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>
                  {mode === 'dark' ? '深色模式' : '浅色模式'}
                </p>
                <p className="text-xs" style={{ color: 'var(--t-text-mute)' }}>
                  跟随眼睛，保护视力
                </p>
              </div>
            </div>
            <button
              onClick={onToggleMode}
              className="relative w-14 h-8 rounded-full transition-colors"
              style={{ backgroundColor: mode === 'dark' ? 'var(--t-accent-500)' : 'var(--t-border-main)' }}
              aria-label="切换明暗主题"
            >
              <span
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform"
                style={{ transform: mode === 'dark' ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
          </li>
          <li className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: 'color-mix(in srgb, var(--t-accent-400) 18%, transparent)',
                color: 'var(--t-accent-600)',
              }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>主题色</p>
                <p className="text-xs" style={{ color: 'var(--t-text-mute)' }}>选择您喜欢的品牌色</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ACCENTS.map((a: { key: AccentKey; label: string; swatch: string }) => {
                const isActive = accent === a.key
                return (
                  <button
                    key={a.key}
                    onClick={() => onChangeAccent(a.key)}
                    className="aspect-square rounded-xl relative flex items-center justify-center transition-all border"
                    style={{
                      background: a.swatch,
                      borderColor: isActive
                        ? 'color-mix(in srgb, var(--t-text-main) 30%, transparent)'
                        : 'color-mix(in srgb, var(--t-border-main) 60%, transparent)',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isActive
                        ? `0 6px 16px -8px color-mix(in srgb, var(--t-text-main) 50%, transparent)`
                        : 'none',
                    }}
                    aria-label={`主题色 ${a.label}`}
                    title={a.label}
                  >
                    {isActive && (
                      <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </li>
        </ul>
      </section>

      <section
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
      >
        <div className="w-full flex items-center gap-3 p-4 text-left">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={tintStyle(MINE_THEME_ABOUT.tint)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>{MINE_THEME_ABOUT.title}</p>
            <p className="text-xs" style={{ color: 'var(--t-text-mute)' }}>{MINE_THEME_ABOUT.summary}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{
            backgroundColor: 'color-mix(in srgb, var(--t-status-ok) 18%, transparent)',
            color: 'var(--t-status-ok)',
          }}>
            {MINE_THEME_ABOUT.badgeLabel}
          </span>
        </div>
      </section>
    </div>
  )
}
