import { useState, useEffect, useRef } from 'react'
import type { ViewMode } from '../App'
import type { PortalCard } from '../data/PortalCardItem'
import {
  BOTTOM_TABS,
  SPOTLIGHT_LABELS,
  SEARCH_PLACEHOLDERS,
  CAPSULE_WIDTH_VW,
  SPOTLIGHT_LIMIT,
  type TabId,
} from '../data/BottomTabBar'
import {
  iconText,
  simplifyTitle,
  defaultSearchKeywords,
} from '../data/PortalCardItem'

const stroke = (active: boolean) => (active ? 0 : 1.8)
const fill = (active: boolean) => (active ? 'currentColor' : 'none')

const TAB_ICONS: Record<TabId, (active: boolean) => React.ReactNode> = {
  console: (active) => (
    <svg className="w-6 h-6" fill={fill(active)} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke(active)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  apps: (active) => (
    <svg className="w-6 h-6" fill={fill(active)} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke(active)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  board: (active) => (
    <svg className="w-6 h-6" fill={fill(active)} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke(active)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  mine: (active) => (
    <svg className="w-6 h-6" fill={fill(active)} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke(active)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
}

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
  spotlightApps?: PortalCard[]
  onOpenApp?: (card: PortalCard) => void
  onExpandedChange?: (expanded: boolean) => void
}

export default function BottomTabBar({
  view, onViewChange, onMine, onShowTBD,
  search = '', onSearchChange, hideGlobalSearch = false,
  searchPlaceholder = SEARCH_PLACEHOLDERS.generic,
  searchHints = [],
  spotlightApps = [],
  onOpenApp,
  onExpandedChange,
}: BottomTabBarProps) {
  const [expanded, setExpandedState] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)
  const showSearchCapsule = view !== 'mine' && !hideGlobalSearch

  const setExpanded = (v: boolean) => {
    setExpandedState(v)
    onExpandedChange?.(v)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    setViewportHeight(window.visualViewport?.height ?? window.innerHeight)
    const vv = window.visualViewport
    const onResize = () => {
      setViewportHeight(vv?.height ?? window.innerHeight)
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
        }
      })
    }
    if (vv) {
      vv.addEventListener('resize', onResize)
      vv.addEventListener('scroll', onResize)
    }
    window.addEventListener('resize', onResize)
    return () => {
      if (vv) {
        vv.removeEventListener('resize', onResize)
        vv.removeEventListener('scroll', onResize)
      }
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (expanded && inputRef.current) {
      const t = setTimeout(() => {
        inputRef.current?.focus()
        if (scrollRef.current) {
          scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight
        }
      }, 30)
      return () => clearTimeout(t)
    }
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const getActiveId = (): TabId => {
    if (view === 'mine') return 'mine'
    if (view === 'system') return 'apps'
    return 'console'
  }
  const activeId = getActiveId()

  const handleClick = (id: TabId) => {
    if (expanded) return
    if (id === 'console') {
      onViewChange('overview')
    } else if (id === 'apps') {
      onViewChange('system')
    } else if (id === 'board') {
      onShowTBD?.('「数据看板」功能开发中，敬请期待')
    } else if (id === 'mine') {
      onMine ? onMine() : onViewChange('mine')
    }
  }

  const safeTop = 'env(safe-area-inset-top, 12px)'
  const safeBottom = 'env(safe-area-inset-bottom, 0px)'
  const searchBarEstimate = 72
  const headerEstimate = 56
  const minHintArea = 140

  const kw = search.trim().toLowerCase()
  const filteredSpotlight = (spotlightApps ?? []).filter(c =>
    !kw ||
    c.title.toLowerCase().includes(kw) ||
    c.description.toLowerCase().includes(kw) ||
    (c.tag ?? '').toLowerCase().includes(kw)
  )

  const layoutHintsMinHeight = viewportHeight
    ? Math.max(minHintArea, viewportHeight - searchBarEstimate - headerEstimate)
    : minHintArea

  const handleInputFocus = () => {
    if (!expanded) {
      setExpanded(true)
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 60)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSearchChange?.('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleCancel = () => {
    onSearchChange?.('')
    setExpanded(false)
  }

  const fallbackHints = searchHints.length > 0
    ? searchHints.filter(k => !kw || k.toLowerCase().includes(kw))
    : defaultSearchKeywords.filter(k => !kw || k.toLowerCase().includes(kw))

  return (
    <>
      {showSearchCapsule && !expanded && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
          <div className="pointer-events-auto relative" style={{ width: `${CAPSULE_WIDTH_VW}vw`, maxWidth: `${CAPSULE_WIDTH_VW}vw` }}>
            <div className="absolute left-0 top-0 h-full pl-3 flex items-center pointer-events-none" style={{ color: 'var(--t-text-sub)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onFocus={handleInputFocus}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={SEARCH_PLACEHOLDERS.capsule}
              className="w-full pl-10 pr-8 py-2.5 rounded-full border text-sm font-medium focus:outline-none focus:ring-2 transition-all appearance-none"
              style={{
                backgroundColor: 'var(--t-header)',
                borderColor: 'var(--t-border-sub)',
                color: 'var(--t-text-main)',
                boxShadow: '0 8px 32px -16px color-mix(in srgb, #000 60%, transparent)',
                backdropFilter: 'saturate(150%) blur(12px)',
                WebkitBackdropFilter: 'saturate(150%) blur(12px)',
                // @ts-ignore
                '--tw-ring-color': 'var(--t-accent-500)',
              } as React.CSSProperties}
              aria-label="打开搜索"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <div className="absolute right-0 top-0 h-full pr-4 flex items-center pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--t-accent-400)' }} />
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div
          className="sm:hidden fixed inset-0 z-[60] flex flex-col"
          style={{
            backgroundColor: 'var(--t-bg)',
            height: viewportHeight ? `${viewportHeight}px` : '100vh',
            maxHeight: viewportHeight ? `${viewportHeight}px` : '100vh',
          }}
          onClick={() => setExpanded(false)}
        >
          <div className="flex-shrink-0 px-4 pt-2 flex items-center justify-between"
            style={{ paddingTop: safeTop, minHeight: `${headerEstimate}px` }}
            onClick={(e) => e.stopPropagation()}>
            {filteredSpotlight.length > 0 && !kw && (
              <div className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-lg"
                style={{
                  color: 'var(--t-text-sub)',
                  backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 10%, transparent)',
                }}>
                {SPOTLIGHT_LABELS.bestSearch}
              </div>
            )}
            <div className="ml-auto">
              <button
                onClick={handleCancel}
                className="text-sm font-semibold px-2.5 py-1.5 rounded-xl transition-colors flex-shrink-0"
                style={{ color: 'var(--t-accent-500)' }}
              >
                取消
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 px-4 overflow-y-auto flex flex-col justify-end"
            style={{ minHeight: `${layoutHintsMinHeight}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-1.5 py-1">
              {fallbackHints.map((hint) => (
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

            {filteredSpotlight.length > 0 && (
              <div className="mt-1 mb-2">
                {!kw && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-1 h-3.5 rounded-full" aria-hidden
                      style={{ background: 'linear-gradient(180deg, var(--t-accent-400), var(--t-accent-600))' }} />
                    <h4 className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--t-text-main)' }}>
                      {SPOTLIGHT_LABELS.sgerSuggest}
                    </h4>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                  {filteredSpotlight.slice(0, kw ? undefined : SPOTLIGHT_LIMIT).map((card) => {
                    const { t: iconChar, bg: iconBg } = iconText(card.title, card.category)
                    const label = simplifyTitle(card.title)
                    return (
                      <a
                        key={card.id}
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 group"
                        onClick={(e) => {
                          if (onOpenApp) {
                            e.preventDefault()
                            onOpenApp(card)
                            setExpanded(false)
                          }
                        }}
                      >
                        <div className="relative w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white font-black transition-transform group-active:scale-95"
                          style={{
                            background: iconBg,
                            fontSize: iconChar.length >= 3 ? '13px' : '18px',
                            boxShadow: '0 6px 16px -10px color-mix(in srgb, #000 60%, transparent)',
                          }}>
                          <div className="absolute inset-0 opacity-25 pointer-events-none rounded-2xl" style={{
                            background: 'radial-gradient(ellipse at 30% 18%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)',
                          }} />
                          <span className="relative z-10 leading-none select-none"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>{iconChar}</span>
                        </div>
                        <span className="text-[11px] font-medium leading-tight text-center line-clamp-1 truncate w-full"
                          style={{ color: 'var(--t-text-main)', minHeight: '14px' }}
                          title={card.title}>{label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 px-4 pt-2 pb-3"
            style={{
              paddingBottom: `calc(12px + ${safeBottom})`,
              borderTop: '1px solid var(--t-border-sub)',
              backgroundColor: 'var(--t-bg)',
              backdropFilter: 'saturate(140%) blur(8px)',
              WebkitBackdropFilter: 'saturate(140%) blur(8px)',
              minHeight: `${searchBarEstimate}px`,
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-0 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--t-card)',
                    color: 'var(--t-text-main)',
                    // @ts-ignore
                    '--tw-ring-color': 'var(--t-accent-500)',
                  } as React.CSSProperties}
                  aria-label="搜索"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {search && (
                  <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                    style={{ color: 'var(--t-text-mute)' }}
                    aria-label="清空"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
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

      {!expanded && (
        <nav
          aria-label="底部导航"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        >
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
              {BOTTOM_TABS.map((tab) => {
                const active = activeId === tab.id
                const isTBD = !!tab.tbd
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
                          {TAB_ICONS[tab.id](active)}
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
      )}
    </>
  )
}
