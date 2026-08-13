import { useState, useMemo, useEffect, useCallback } from 'react'
import { regions } from './data/portal'
import type { PortalCard } from './data/portal'
import Header from './components/Header'
import Footer from './components/Footer'
import PortalCardItem from './components/PortalCardItem'
import Toast, { type ToastItem } from './components/Toast'
import { useFavorites } from './hooks/useFavorites'
import { useRecentVisit } from './hooks/useRecentVisit'

export type AccentKey = 'blue' | 'emerald' | 'violet' | 'rose' | 'amber'
export type Mode = 'light' | 'dark'
export type ViewMode = 'overview' | 'favorites' | 'recent'

const STORAGE_MODE = 'portal:theme-mode'
const STORAGE_ACCENT = 'portal:theme-accent'
const STORAGE_VIEW = 'portal:view-mode'
const STORAGE_TAB = 'portal:active-tab'

const TAB_ALL = '__all__' as const

const regionNameShort = (id: string) =>
  id === 'dev' ? '研发效能' :
  id === 'ops' ? '运维监控' :
  id === 'data' ? '数据分析' :
  id === 'ai'  ? 'AI 能力' :
  id === 'office' ? '办公协作' :
  id === 'cloud'  ? '云服务'   : '其他'

export default function App() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'overview'
    return (localStorage.getItem(STORAGE_VIEW) as ViewMode) || 'overview'
  })
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem(STORAGE_MODE) as Mode | null
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [accent, setAccent] = useState<AccentKey>(() => {
    if (typeof window === 'undefined') return 'blue'
    return (localStorage.getItem(STORAGE_ACCENT) as AccentKey) || 'blue'
  })
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === 'undefined') return TAB_ALL
    return localStorage.getItem(STORAGE_TAB) ?? TAB_ALL
  })
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()
  const { recentIds, record: recordVisit } = useRecentVisit()

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem(STORAGE_MODE, mode)
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
    localStorage.setItem(STORAGE_ACCENT, accent)
  }, [accent])

  useEffect(() => { localStorage.setItem(STORAGE_VIEW, view) }, [view])
  useEffect(() => { localStorage.setItem(STORAGE_TAB, activeTab) }, [activeTab])

  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'))

  const pushToast = useCallback((message: string, type?: ToastItem['type']) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message, type }])
  }, [])
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleToggleFavorite = useCallback((id: number, cardTitle?: string) => {
    const willFavorite = !isFavorite(id)
    toggleFavorite(id)
    pushToast(
      willFavorite
        ? `已收藏 · ${cardTitle ?? '应用'}`
        : `已取消收藏 · ${cardTitle ?? '应用'}`
    )
  }, [isFavorite, toggleFavorite, pushToast])

  const allCards = useMemo<PortalCard[]>(() => {
    const list: PortalCard[] = []
    regions.forEach(r => r.cards.forEach(c => list.push(c)))
    return list
  }, [])

  const cardById = useMemo(() => {
    const map = new Map<number, PortalCard>()
    allCards.forEach(c => map.set(c.id, c))
    return map
  }, [allCards])

  const favoriteCards = useMemo<PortalCard[]>(
    () => favoriteIds.map(id => cardById.get(id)).filter((c): c is PortalCard => !!c),
    [favoriteIds, cardById],
  )
  const recentCards = useMemo<PortalCard[]>(
    () => recentIds.map(id => cardById.get(id)).filter((c): c is PortalCard => !!c),
    [recentIds, cardById],
  )

  const kw = search.trim().toLowerCase()

  const applyKw = (list: PortalCard[]) =>
    !kw ? list : list.filter(c =>
      c.title.toLowerCase().includes(kw) ||
      c.description.toLowerCase().includes(kw) ||
      (c.tag ?? '').toLowerCase().includes(kw)
    )

  // 视图决定数据源
  const viewSource: PortalCard[] =
    view === 'favorites' ? favoriteCards :
    view === 'recent'    ? recentCards    :
    allCards

  // Tabs 筛选（只在 overview 视图下生效；其他视图下 Tabs 只读样式，不筛选数据源）
  const tabFiltered: PortalCard[] =
    view === 'overview'
      ? activeTab === TAB_ALL
        ? viewSource
        : viewSource.filter(c => c.category === activeTab)
      : viewSource

  const displayCards = applyKw(tabFiltered)

  // 构建 Tab 列表（带数量）
  type TabItem = { id: string; label: string; count: number }
  const tabs: TabItem[] = useMemo(() => {
    const makeCount = (cat: string | undefined) => {
      const base = view === 'favorites' ? favoriteCards : view === 'recent' ? recentCards : allCards
      const data = cat === undefined ? base : base.filter(c => c.category === cat)
      return !kw ? data.length : applyKw(data).length
    }
    const list: TabItem[] = [{ id: TAB_ALL, label: '全部', count: makeCount(undefined) }]
    regions.forEach(r => list.push({ id: r.id, label: regionNameShort(r.id), count: makeCount(r.id) }))
    return list
  }, [view, favoriteCards, recentCards, allCards, kw])

  const handleTabChange = (id: string) => {
    if (view !== 'overview') setView('overview')
    setActiveTab(id)
  }

  const handleViewChange = (v: ViewMode) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderCard = (card: PortalCard) => (
    <PortalCardItem
      key={card.id}
      card={card}
      isFavorite={isFavorite(card.id)}
      onToggleFavorite={(id) => handleToggleFavorite(id, card.title)}
      onVisit={recordVisit}
    />
  )

  const primaryBtnLabel =
    view === 'favorites' ? '浏览全部应用' :
    view === 'recent'    ? '返回控制台' :
    `+ 快速收藏`

  const onPrimaryClick = () => {
    if (view === 'favorites' || view === 'recent') setView('overview')
    else setView('favorites')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--t-bg)' }}>
      <Header
        search={search}
        setSearch={setSearch}
        mode={mode}
        onToggleMode={toggleMode}
        accent={accent}
        onChangeAccent={setAccent}
        onViewChange={handleViewChange}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-4 sm:pt-4 sm:pb-6 lg:pt-5 lg:pb-7">
        {/* 搜索结果 / 视图内无结果 的空态 */}
        {search.trim() && displayCards.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={
              <>
                没有匹配 “<span style={{ color: 'var(--t-text-main)' }}>{search}</span>” 的应用
              </>
            }
            subtitle={
              view === 'favorites' ? '试试清空搜索，或在全部应用中搜索' :
              view === 'recent'    ? '在最近访问中没有匹配项，试试浏览全部应用' :
              '换个关键词，或检查应用名称是否正确'
            }
            onClear={() => setSearch('')}
            action={view !== 'overview' ? { label: '浏览全部应用', onClick: () => { setView('overview'); setSearch('') }, variant: 'primary' } : undefined}
          />
        ) : !search.trim() && view !== 'overview' && displayCards.length === 0 ? (
          view === 'favorites' ? (
            <EmptyState
              icon="⭐"
              title="暂无收藏的应用"
              subtitle="点击应用卡片左下角「收藏」星标，将常用系统加入收藏，下次可在控制台一键访问"
              action={{ label: '去浏览应用', onClick: () => setView('overview'), variant: 'primary' }}
            />
          ) : (
            <EmptyState
              icon="🕒"
              title="暂无最近访问记录"
              subtitle="点击进入任意应用，这里会显示你最近访问过的最多 12 个系统"
              action={{ label: '开始逛一逛', onClick: () => setView('overview'), variant: 'primary' }}
            />
          )
        ) : (
          <>
            {/* 分类 Tabs + CTA：sticky 吸顶（Header h-16 = 64px） */}
            <div
              className="sticky z-30 rounded-2xl border p-2 sm:p-2.5 mb-3 sm:mb-4 flex items-center gap-2"
              style={{
                top: '64px',
                backgroundColor: 'var(--t-card)',
                borderColor: 'var(--t-border-sub)',
                boxShadow: '0 6px 20px -16px color-mix(in srgb, #000 60%, transparent)',
                backdropFilter: 'saturate(140%) blur(8px)',
              }}
              role="tablist"
              aria-label="应用分类筛选"
            >
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide min-w-0 flex-1">
                {tabs.map(t => {
                  const isActive = view === 'overview' ? activeTab === t.id : t.id === TAB_ALL
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabChange(t.id)}
                      className="relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))'
                          : 'transparent',
                        color: isActive ? '#fff' : 'var(--t-text-sub)',
                        boxShadow: isActive
                          ? `0 6px 18px -8px color-mix(in srgb, var(--t-accent-500) 70%, transparent)`
                          : 'none',
                      } as React.CSSProperties}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--t-bg)'; e.currentTarget.style.color = 'var(--t-text-main)' } }}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--t-text-sub)' } }}
                    >
                      <span>{t.label}</span>
                      <span
                        className="px-1.5 py-px rounded-full text-[10px] font-semibold min-w-[20px] text-center"
                        style={{
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--t-border-sub)',
                          color: isActive ? '#fff' : 'var(--t-text-mute)',
                        }}
                      >
                        {t.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* CTA：浏览全部应用/返回控制台/+快速收藏 —— 随视图切换 */}
              <button
                onClick={onPrimaryClick}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))',
                  boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)`,
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              >
                {primaryBtnLabel.includes('+') && <span className="text-lg leading-none">+</span>}
                <span className="hidden sm:inline">{primaryBtnLabel.replace('+ ', '')}</span>
                <span className="sm:hidden">{primaryBtnLabel.includes('浏览') ? '全部' : primaryBtnLabel.includes('返回') ? '返回' : '收藏'}</span>
              </button>
            </div>

            {/* 匹配结果数量栏（搜索态 or 视图态） */}
            <div className="flex items-center justify-between mb-3.5 px-1">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--t-text-sub)' }}>
                <span style={{ color: 'var(--t-text-mute)' }}>
                  {view === 'overview' ? '当前分类' : view === 'favorites' ? '收藏夹' : '最近访问'}
                </span>
                <span>
                  <span style={{ color: 'var(--t-text-main)', fontWeight: 600 }}>{displayCards.length}</span> 个匹配应用
                </span>
                {search.trim() && (
                  <span className="hidden sm:inline" style={{ color: 'var(--t-text-mute)' }}>
                    · 关键词 “<span style={{ color: 'var(--t-accent-500)' }}>{search}</span>”
                  </span>
                )}
              </div>
              {search.trim() && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs sm:text-sm px-2 py-1 rounded-lg transition-colors"
                  style={{ color: 'var(--t-accent-500)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--t-accent-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  清空搜索
                </button>
              )}
            </div>

            {/* 卡片网格：UniLink 4列（sm:2 md:3 lg:4） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayCards.map(renderCard)}
            </div>
          </>
        )}
      </main>

      <Footer />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function EmptyState({
  icon, title, subtitle, onClear, action,
}: {
  icon: string
  title: React.ReactNode
  subtitle?: string
  onClear?: () => void
  action?: { label: string; onClick: () => void; variant: 'primary' | 'ghost' }
}) {
  return (
    <div
      className="border rounded-2xl flex flex-col items-center justify-center py-16 sm:py-20"
      style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
    >
      <div
        className="rounded-3xl flex items-center justify-center mb-4 w-16 h-16 text-3xl sm:w-20 sm:h-20 sm:text-4xl"
        style={{
          backgroundColor: 'var(--t-border-sub)',
          boxShadow: `inset 0 0 0 1px var(--t-border-main)`,
        }}
      >
        {icon}
      </div>
      <p className="text-sm sm:text-base font-semibold mb-1.5" style={{ color: 'var(--t-text-main)' }}>{title}</p>
      {subtitle && (
        <p className="text-xs sm:text-[13px] mb-5 max-w-md text-center px-4" style={{ color: 'var(--t-text-mute)' }}>{subtitle}</p>
      )}
      <div className="flex items-center gap-2.5">
        {action ? (
          <button
            onClick={action.onClick}
            className="text-sm px-5 py-2.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: action.variant === 'primary'
                ? 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))'
                : 'transparent',
              color: action.variant === 'primary' ? '#fff' : 'var(--t-accent-600)',
              boxShadow: action.variant === 'primary'
                ? `0 10px 30px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)`
                : 'none',
            }}
          >
            {action.label}
          </button>
        ) : null}
        {onClear ? (
          <button
            onClick={onClear}
            className="text-sm px-4 py-2.5 rounded-xl font-medium transition-colors border"
            style={{
              color: 'var(--t-accent-600)',
              borderColor: 'var(--t-border-sub)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--t-bg)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            清除搜索
          </button>
        ) : null}
      </div>
    </div>
  )
}
