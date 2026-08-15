import { useState, useEffect, useRef } from 'react'
import type { ViewMode } from '../App'

type TabId = 'console' | 'apps' | 'board' | 'mine'

interface BottomTabBarProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onMine?: () => void
  onShowTBD?: (msg: string) => void
  search?: string
  onSearchChange?: (v: string) => void
  hideGlobalSearch?: boolean
  searchPlaceholder?: string
  searchHints?: string[]
}

const TABS: {
  id: TabId
  label: string
  icon: (active: boolean) => React.ReactNode
}[] = [
  {
    id: 'console',
    label: '首页',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'apps',
    label: '管理',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'board',
    label: '看板',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    id: 'mine',
    label: '我的',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomTabBar({
  view, onViewChange, onMine, onShowTBD,
  search = '', onSearchChange, hideGlobalSearch = false,
  searchPlaceholder = '搜索系统、名称、功能…',
  searchHints = [],
}: BottomTabBarProps) {
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // 展开/收起自动聚焦输入框
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [expanded])

  // Esc 收起
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const getActiveId = (): TabId => {
    if (view === 'mine') return 'mine'
    if (view === 'system') return 'apps'
    // 移动端 APP：全量系统卡片（overview）属于「首页」，无论 overview/favorites/recent 都让首页高亮
    return 'console'
  }
  const activeId = getActiveId()

  const handleClick = (id: TabId) => {
    if (expanded) return
    if (id === 'console') {
      // 首页 Tab → 直接显示全量系统卡片 overview（不再 favorites 空态）
      onViewChange('overview')
    } else if (id === 'apps') {
      // 管理 Tab → 进入管理中心（与 PC 端一致）
      onViewChange('system')
    } else if (id === 'board') {
      // 看板页 - 对应 PC 端「数据看板」，待开发 TBD
      onShowTBD?.('「数据看板」功能开发中，敬请期待')
    } else if (id === 'mine') {
      onMine ? onMine() : onViewChange('mine')
    }
  }

  return (
    <>
      {/* iPhone 风格搜索：展开态 —— 推介内容（建议词列表）在上，可点击作为主内容；输入框贴底部，键盘弹起时自动把它顶到键盘上方 */}
      {expanded && (
        <div
          className="sm:hidden fixed inset-0 z-[60] flex flex-col"
          style={{ backgroundColor: 'var(--t-bg)' }}
          onClick={() => setExpanded(false)}
        >
          {/* 顶部：状态栏/安全区留白 + 取消按钮，避免刘海遮挡内容 */}
          <div className="flex-shrink-0 px-4 pt-2 flex items-center justify-end"
            style={{ paddingTop: 'env(safe-area-inset-top, 12px)', minHeight: '52px' }}
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { onSearchChange?.(''); setExpanded(false) }}
              className="text-sm font-semibold px-2.5 py-1.5 rounded-xl transition-colors flex-shrink-0"
              style={{ color: 'var(--t-accent-500)' }}
            >
              取消
            </button>
          </div>

          {/* 中部：搜索推介词（主内容），以列表形式作为可点击"背景"，占据全部上方空间 */}
          <div className="flex-1 min-h-0 px-4 pt-1 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <ul className="space-y-1.5 pb-4">
              {(searchHints.length > 0
                ? searchHints.filter(k => !search.trim() || k.toLowerCase().includes(search.toLowerCase()))
                : [
                  'Jenkins 流水线', 'Grafana 监控', 'Kubernetes 集群', 'ClickHouse 分析', 'GitLab 仓库',
                ].filter(k => !search.trim() || k.toLowerCase().includes(search.toLowerCase()))
              ).map((hint) => (
                <li key={hint}>
                  <button
                    onClick={() => { onSearchChange?.(hint); setExpanded(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors active:bg-[var(--t-elev)]"
                    style={{ backgroundColor: 'var(--t-card)' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-mute)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm truncate flex-1" style={{ color: 'var(--t-text-main)' }}>{hint}</span>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-mute)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 底部：搜索输入框贴底，键盘弹起时自动被顶在键盘上方（iOS/Android 浏览器会压缩 fixed inset-0 的底部空间） */}
          <div className="flex-shrink-0 px-4 pt-2 pb-3"
            style={{
              paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
              borderTop: '1px solid var(--t-border-sub)',
              backgroundColor: 'var(--t-bg)',
              backdropFilter: 'saturate(140%) blur(8px)',
              WebkitBackdropFilter: 'saturate(140%) blur(8px)',
            }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--t-text-mute)' }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-0 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--t-card)',
                    color: 'var(--t-text-main)',
                    // @ts-ignore
                    '--tw-ring-color': 'var(--t-accent-500)',
                  } as React.CSSProperties}
                  aria-label="搜索"
                />
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                style={{ color: 'var(--t-accent-500)' }}
                aria-label="收起搜索">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="底部导航"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col"
      >
        {/* 小搜索框（点击放大）—— 仅在非「我的」视图 & 未进入管理功能子页时显示；宽度屏幕 1/2 居中 */}
        {view !== 'mine' && !hideGlobalSearch && (
          <div className="w-full flex justify-center pb-2">
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-lg transition-all active:scale-[0.99]"
              style={{
                width: '50vw',
                maxWidth: '50vw',
                backgroundColor: 'var(--t-header)',
                borderColor: 'var(--t-border-sub)',
                boxShadow: '0 8px 32px -16px color-mix(in srgb, #000 60%, transparent)',
                backdropFilter: 'saturate(150%) blur(12px)',
                WebkitBackdropFilter: 'saturate(150%) blur(12px)',
              }}
              aria-label="打开搜索"
            >
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-sub)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium truncate" style={{ color: 'var(--t-text-mute)' }}>
                {search?.trim() || '搜索'}
              </span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--t-accent-400)' }} />
            </button>
          </div>
        )}

        {/* 底部 4 Tab 菜单栏 */}
        <div
          className="border-t"
          style={{
            backgroundColor: 'var(--t-header)',
            borderColor: 'var(--t-border-sub)',
            boxShadow: '0 -4px 24px -16px color-mix(in srgb, #000 50%, transparent)',
            backdropFilter: 'saturate(150%) blur(12px)',
            WebkitBackdropFilter: 'saturate(150%) blur(12px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <ul className="flex items-stretch justify-around py-1.5 px-2">
            {TABS.map((tab) => {
              const active = activeId === tab.id
              const isTBD = tab.id === 'board'
              return (
                <li key={tab.id} className="flex-1 flex justify-center">
                  <button
                    onClick={() => handleClick(tab.id)}
                    className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all w-full"
                    style={{
                      color: active ? 'var(--t-accent-500)' : 'var(--t-text-sub)',
                      backgroundColor: active
                        ? 'color-mix(in srgb, var(--t-accent-500) 8%, transparent)'
                        : 'transparent',
                      opacity: isTBD ? 0.75 : 1,
                    }}
                    aria-current={active ? 'page' : undefined}
                    disabled={expanded}
                  >
                    <div className="relative">
                      <div
                        className="transition-transform"
                        style={{ transform: active ? 'translateY(-1px) scale(1.05)' : 'none' }}
                      >
                        {tab.icon(active)}
                      </div>
                      {isTBD && (
                        <span
                          className="absolute -top-1 -right-3 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                            color: '#fff',
                          }}
                        >
                          开发中
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[11px] font-semibold leading-none mt-0.5 transition-all"
                      style={{
                        letterSpacing: active ? '0.02em' : '0',
                        color: active ? 'var(--t-accent-600)' : 'var(--t-text-mute)',
                      }}
                    >
                      {tab.label}
                    </span>
                    {isTBD && (
                      <span
                        className="text-[9px] leading-none mt-0.5 font-semibold"
                        style={{ color: 'var(--t-text-mute)' }}
                      >
                        TBD
                      </span>
                    )}
                    {active && (
                      <span
                        className="mt-1 w-5 h-1 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, var(--t-accent-400), var(--t-accent-600))',
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
