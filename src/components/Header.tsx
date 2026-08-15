import { useState, useEffect } from 'react'
import type { Mode } from '../App'
import type { ViewMode } from '../App'
import type { AccentKey } from '../data/portal'
import { ACCENTS } from '../data/portal'

interface HeaderProps {
  search: string
  setSearch: (v: string) => void
  mode: Mode
  onToggleMode: () => void
  accent: AccentKey
  onChangeAccent: (a: AccentKey) => void
  onViewChange: (v: ViewMode) => void
  view: ViewMode
}

interface TopNavItem { id: ViewMode; label: string }
const TOP_NAV: TopNavItem[] = [
  { id: 'overview',  label: '首页' },
  { id: 'system',    label: '系统管理' },
  { id: 'overview',  label: '数据看板' },
]

export default function Header({
  search, setSearch, mode, onToggleMode, accent, onChangeAccent, onViewChange, view,
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (!showSettings) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowSettings(false) }
    const onScroll = () => setShowSettings(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [showSettings])

  useEffect(() => {
    if (!showUserMenu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowUserMenu(false) }
    const onScroll = () => setShowUserMenu(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [showUserMenu])

  const handleNavClick = (_id: ViewMode, label: string) => {
    if (label === '系统管理') onViewChange('system')
    else onViewChange('overview')
  }

  const navActiveLabel = view === 'system' ? '系统管理' : '首页'

  return (
    <header
      className="sticky top-0 z-50 border-b hidden sm:block"
      style={{
        backgroundColor: 'var(--t-header)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4 min-w-0">
          {/* 左侧 Logo：SG 徽章 + SanGer 文字（仅桌面端显示，移动端完全隐藏） */}
          <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
            <div
              className="rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden"
              style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, var(--t-accent-400) 0%, var(--t-accent-500) 50%, var(--t-accent-700) 100%)',
              }}
            >
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 20%, #fff 0%, transparent 50%)' }} />
              <span className="relative text-white font-black text-[14px] leading-none tracking-tighter select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>SG</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-black tracking-tight" style={{
                color: 'var(--t-text-main)',
                background: 'linear-gradient(135deg, var(--t-accent-500) 0%, var(--t-accent-600) 50%, var(--t-accent-700) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SanGer
              </span>
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{
                background: 'linear-gradient(135deg, var(--t-accent-500), var(--t-accent-700))',
                color: '#fff',
                boxShadow: `0 1px 4px color-mix(in srgb, var(--t-accent-500) 30%, transparent)`,
              }}>
                企业版
              </span>
            </div>
          </div>

          {/* 中间主导航 */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-shrink-0" aria-label="主导航">
            {TOP_NAV.map((n, idx) => {
              const isActive = navActiveLabel === n.label
              return (
                <button
                  key={`${n.id}-${n.label}-${idx}`}
                  onClick={() => handleNavClick(n.id, n.label)}
                  className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? 'var(--t-elev)' : 'transparent',
                    color: isActive ? 'var(--t-text-main)' : 'var(--t-text-sub)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--t-card)' } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent' } }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {n.label}
                </button>
              )
            })}
          </nav>

          {/* 右侧：搜索框 / 通知 / 设置 / 头像 */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* 搜索框（桌面端） */}
            <div className="relative block">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none" style={{ color: 'var(--t-text-mute)' }}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={search ? '' : '搜索系统…'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all w-44 lg:w-64"
                style={{
                  backgroundColor: 'var(--t-card)',
                  borderColor: 'var(--t-border-sub)',
                  color: 'var(--t-text-main)',
                  // @ts-ignore
                  '--tw-ring-color': 'var(--t-accent-500)',
                } as React.CSSProperties}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--t-accent-500)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--t-border-sub)' }}
                aria-label="搜索系统或集成"
              />
            </div>

            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--t-card)', color: 'var(--t-text-sub)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--t-elev)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--t-card)'}
              title="通知"
              aria-label="通知"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--t-status-ok)' }} />
            </button>

            {/* 设置按钮（内含主题色 + 亮暗切换 + 其他入口） */}
            <div className="relative">
              <button
                onClick={() => { setShowSettings(!showSettings); setShowUserMenu(false) }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--t-card)', color: 'var(--t-text-sub)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--t-elev)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--t-card)'}
                title="设置"
                aria-label="设置"
                aria-expanded={showSettings}
                aria-haspopup="menu"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.3 3.6a2 2 0 013.4 0l.6 1a2 2 0 002.2.9l1.2-.4a2 2 0 012.6 2.6l-.4 1.2a2 2 0 00.9 2.2l1 .6a2 2 0 010 3.4l-1 .6a2 2 0 00-.9 2.2l.4 1.2a2 2 0 01-2.6 2.6l-1.2-.4a2 2 0 00-2.2.9l-.6 1a2 2 0 01-3.4 0l-.6-1a2 2 0 00-2.2-.9l-1.2.4a2 2 0 01-2.6-2.6l.4-1.2a2 2 0 00-.9-2.2l-1-.6a2 2 0 010-3.4l1-.6a2 2 0 00.9-2.2l-.4-1.2a2 2 0 012.6-2.6l1.2.4a2 2 0 002.2-.9l.6-1z" />
                  <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
                </svg>
              </button>
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} aria-hidden />
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 rounded-2xl border shadow-2xl py-2 w-72"
                    style={{ backgroundColor: 'var(--t-card)', borderColor: 'var(--t-border-main)' }}
                  >
                    <div className="px-3 pt-1 pb-2">
                      <div className="text-[11px] font-semibold tracking-wider uppercase mb-2.5 px-1.5" style={{ color: 'var(--t-text-mute)' }}>
                        外观设置
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px]"
                              style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', color: '#fff' }}
                            >
                              ◐
                            </span>
                            <span className="text-sm font-medium" style={{ color: 'var(--t-text-main)' }}>主题颜色</span>
                          </div>
                          <span className="text-[11px]" style={{ color: 'var(--t-text-mute)' }}>
                            {ACCENTS.find(a => a.key === accent)?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          {ACCENTS.map(a => (
                            <button
                              key={a.key}
                              role="menuitemradio"
                              aria-checked={accent === a.key}
                              onClick={() => { onChangeAccent(a.key) }}
                              className="relative w-9 h-9 rounded-xl border-2 transition-transform hover:scale-110 flex items-center justify-center"
                              title={a.label}
                              aria-label={a.label}
                              style={{
                                background: a.swatch,
                                borderColor: accent === a.key ? 'var(--t-text-main)' : 'transparent',
                              }}
                            >
                              {accent === a.key && (
                                <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px]"
                            style={{ backgroundColor: 'var(--t-elev)', color: 'var(--t-text-main)' }}
                          >
                            {mode === 'dark' ? '🌙' : '☀️'}
                          </span>
                          <div>
                            <div className="text-sm font-medium" style={{ color: 'var(--t-text-main)' }}>深色模式</div>
                            <div className="text-[11px]" style={{ color: 'var(--t-text-mute)' }}>
                              {mode === 'dark' ? '当前使用深色主题' : '当前使用浅色主题'}
                            </div>
                          </div>
                        </div>
                        <button
                          role="menuitem"
                          onClick={onToggleMode}
                          className="relative w-11 h-6 rounded-full transition-colors"
                          style={{
                            backgroundColor: mode === 'dark' ? 'var(--t-accent-500)' : 'var(--t-border-sub)',
                          }}
                          aria-label={mode === 'dark' ? '切换亮色模式' : '切换暗色模式'}
                        >
                          <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                            style={{
                              transform: mode === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="h-px mx-3 my-1" style={{ backgroundColor: 'var(--t-border-sub)' }} />

                    <div className="px-1.5 py-1" role="none">
                      {[
                        { icon: '🔔', label: '通知设置' },
                        { icon: '👥', label: '成员与权限' },
                        { icon: '🔐', label: '安全策略' },
                        { icon: '❓', label: '帮助与反馈' },
                      ].map(item => (
                        <button
                          key={item.label}
                          role="menuitem"
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors"
                          style={{ color: 'var(--t-text-sub)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--t-bg)'; e.currentTarget.style.color = 'var(--t-text-main)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--t-text-sub)' }}
                        >
                          <span className="text-[15px] leading-none">{item.icon}</span>
                          <span className="flex-1 text-left">{item.label}</span>
                          <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 头像：「三」+ 用户下拉菜单（可点击查看） */}
            <div className="relative ml-0.5">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowSettings(false) }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shadow-sm transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--t-accent-400) 0%, var(--t-accent-600) 100%)',
                }}
                title="管理员"
                aria-label="用户菜单"
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
              >
                三
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} aria-hidden />
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 rounded-2xl border shadow-2xl py-1.5 w-60"
                    style={{ backgroundColor: 'var(--t-card)', borderColor: 'var(--t-border-main)' }}
                  >
                    {/* 用户卡片头部 */}
                    <div className="px-3 pt-2 pb-3 flex items-center gap-2.5">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[15px] shadow-sm flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--t-accent-400) 0%, var(--t-accent-600) 100%)',
                        }}
                      >
                        三
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: 'var(--t-text-main)' }}>三掌柜</div>
                        <div className="text-[11px] truncate" style={{ color: 'var(--t-text-mute)' }}>超级管理员 · 三格尔科技</div>
                      </div>
                    </div>

                    <div className="h-px mx-3 my-1" style={{ backgroundColor: 'var(--t-border-sub)' }} />

                    <div className="px-1 py-1" role="none">
                      {[
                        { icon: '👤', label: '查看个人资料' },
                        { icon: '💼', label: '我的工作台' },
                        { icon: '🔑', label: '账号与安全' },
                        { icon: '⚙️', label: '偏好设置' },
                      ].map(item => (
                        <button
                          key={item.label}
                          role="menuitem"
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors"
                          style={{ color: 'var(--t-text-sub)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--t-bg)'; e.currentTarget.style.color = 'var(--t-text-main)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--t-text-sub)' }}
                        >
                          <span className="text-[15px] leading-none">{item.icon}</span>
                          <span className="flex-1 text-left">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="h-px mx-3 my-1" style={{ backgroundColor: 'var(--t-border-sub)' }} />

                    <div className="px-1 pt-0.5 pb-1">
                      <button
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors"
                        style={{ color: 'var(--rose-600, #E11D48)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, #E11D48 10%, transparent)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <span className="text-[15px] leading-none">🚪</span>
                        <span className="flex-1 text-left font-medium">退出登录</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 移动端搜索框：独占一行 */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none" style={{ color: 'var(--t-text-mute)' }}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={search ? '' : '搜索应用…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--t-card)',
                borderColor: 'var(--t-border-sub)',
                color: 'var(--t-text-main)',
                // @ts-ignore
                '--tw-ring-color': 'var(--t-accent-500)',
              } as React.CSSProperties}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--t-accent-500)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--t-border-sub)' }}
              aria-label="搜索应用或集成"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
