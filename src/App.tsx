import { useState, useMemo, useEffect, useCallback } from 'react'
import { regions } from './data/portal'
import type { PortalCard, AccentKey } from './data/portal'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomTabBar from './components/BottomTabBar'
import MinePage from './components/MinePage'
import SystemPage from './components/SystemPage'
import PortalCardItem from './components/PortalCardItem'
import Toast, { type ToastItem } from './components/Toast'
import { useFavorites } from './hooks/useFavorites'
import { useRecentVisit } from './hooks/useRecentVisit'

export type Mode = 'light' | 'dark'
export type ViewMode = 'overview' | 'favorites' | 'recent' | 'mine' | 'system'

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
  // 移动端分区展开状态：key=region.id，true=展开全部，false/undefined=默认最多 8 个
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({})

  const toggleRegion = (rid: string) =>
    setExpandedRegions(prev => ({ ...prev, [rid]: !prev[rid] }))

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
        ? `已收藏 · ${cardTitle ?? '系统'}`
        : `已取消收藏 · ${cardTitle ?? '系统'}`
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

  // Tabs 标签显示逻辑（移动端两字简洁，桌面端完整）
  const tabLabelFor = (id: string, full: string) => {
    if (id === TAB_ALL) return '全部'
    if (id === 'dev')   return '研发'
    if (id === 'ops')   return '运维'
    if (id === 'data')  return '分析'
    if (id === 'ai')    return 'AI'
    if (id === 'cloud') return '云服务'
    return full
  }

  // 构建 Tab 列表（带数量）
  type TabItem = { id: string; label: string; count: number; short: string }
  const tabs: TabItem[] = useMemo(() => {
    const makeCount = (cat: string | undefined) => {
      const base = view === 'favorites' ? favoriteCards : view === 'recent' ? recentCards : allCards
      const data = cat === undefined ? base : base.filter(c => c.category === cat)
      return !kw ? data.length : applyKw(data).length
    }
    const list: TabItem[] = [{ id: TAB_ALL, label: '全部', short: '全部', count: makeCount(undefined) }]
    regions.forEach(r => list.push({
      id: r.id,
      label: regionNameShort(r.id),
      short: tabLabelFor(r.id, regionNameShort(r.id)),
      count: makeCount(r.id),
    }))
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
    view === 'favorites' ? '浏览全部系统' :
    view === 'recent'    ? '返回首页' :
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
        view={view}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-24 sm:pt-4 sm:pb-6 lg:pt-5 lg:pb-7">
        {/* 我的面板 */}
        {view === 'mine' ? (
          <MinePage
            mode={mode}
            onToggleMode={toggleMode}
            accent={accent}
            onChangeAccent={setAccent}
          />
        ) : view === 'system' ? (
          <SystemPage />
        ) : (
          /* 系统视图（搜索 / 收藏 / 最近 / 全部分类） */
          search.trim() && displayCards.length === 0 ? (
            <EmptyState
              icon="🔍"
              title={
                <>
                  没有匹配 “<span style={{ color: 'var(--t-text-main)' }}>{search}</span>” 的系统
                </>
              }
              subtitle={
                view === 'favorites' ? '试试清空搜索，或在全部系统中搜索' :
                view === 'recent'    ? '在最近访问中没有匹配项，试试浏览全部系统' :
                '换个关键词，或检查系统名称是否正确'
              }
              onClear={() => setSearch('')}
              action={view !== 'overview' ? { label: '浏览全部系统', onClick: () => { setView('overview'); setSearch('') }, variant: 'primary' } : undefined}
            />
          ) : !search.trim() && view !== 'overview' && displayCards.length === 0 ? (
            view === 'favorites' ? (
              <EmptyState
                icon="⭐"
                title="暂无收藏的系统"
                subtitle="点击系统卡片左下角「收藏」星标，将常用系统加入收藏，下次可在首页一键访问"
                action={{ label: '去浏览系统', onClick: () => setView('overview'), variant: 'primary' }}
              />
            ) : view === 'recent' ? (
              <EmptyState
                icon="🕒"
                title="暂无最近访问记录"
                subtitle="点击进入任意应用，这里会显示你最近访问过的最多 12 个系统"
                action={{ label: '开始逛一逛', onClick: () => setView('overview'), variant: 'primary' }}
              />
            ) : null
          ) : (
            <>
              {/* 分类 Tabs + CTA：sticky 吸顶 —— 移动端隐藏（sm:hidden），仅桌面端 sm+ 显示 */}
            <div
              className="hidden sm:flex sticky z-30 rounded-2xl border p-2.5 mb-4 items-center gap-2"
              style={{
                top: '64px',
                backgroundColor: 'var(--t-card)',
                borderColor: 'var(--t-border-sub)',
                boxShadow: '0 6px 20px -16px color-mix(in srgb, #000 60%, transparent)',
                backdropFilter: 'saturate(140%) blur(8px)',
              }}
              role="tablist"
              aria-label="系统分类筛选"
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
                      {/* 桌面端：完整标签 + 数量；移动端：两字短标签，无数量 */}
                      <span className="hidden sm:inline">{t.label}</span>
                      <span className="sm:hidden">{t.short}</span>
                      <span className="hidden sm:inline-block px-1.5 py-px rounded-full text-[10px] font-semibold min-w-[20px] text-center"
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

              {/* CTA：浏览全部系统/返回首页/+快速收藏 —— 随视图切换（桌面端显示） */}
              <button
                onClick={onPrimaryClick}
                className="hidden sm:inline-flex flex-shrink-0 items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))',
                  boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)`,
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              >
                {primaryBtnLabel.includes('+') && <span className="text-lg leading-none">+</span>}
                <span>{primaryBtnLabel.replace('+ ', '')}</span>
              </button>
            </div>

            {/* 匹配结果数量栏（搜索态 or 视图态）—— 移动端隐藏，桌面端 sm+ 显示 */}
            <div className="hidden sm:flex items-center justify-between mb-3.5 px-1">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--t-text-sub)' }}>
                <span style={{ color: 'var(--t-text-mute)' }}>
                  {view === 'overview' ? '当前分类' : view === 'favorites' ? '收藏夹' : '最近访问'}
                </span>
                <span>
                  <span style={{ color: 'var(--t-text-main)', fontWeight: 600 }}>{displayCards.length}</span> 个匹配系统
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

            {/* 桌面端 sm+：卡片网格（完整卡片样式，原 2/3/4 阶梯） */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {displayCards.map(renderCard)}
            </div>

            {/* 移动端 sm 以下：按 regions 分区域展示 —— 每个分区默认最多 8 个，点击「全部›」展开显示全部 */}
            {/* 搜索态（有关键词输入）直接平铺，不分区块，匹配集中显示；无匹配分区自动过滤不显示 */}
            <div className="sm:hidden space-y-6">
              {search.trim() ? (
                <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                  {displayCards.map(renderCard)}
                </div>
              ) : (
                regions.map(r => {
                  const regCards = displayCards.filter(c => c.category === r.id)
                  if (regCards.length === 0) return null
                  const expanded = !!expandedRegions[r.id]
                  const showExpandBtn = regCards.length > 8
                  const visibleCards = expanded ? regCards : regCards.slice(0, 8)
                  return (
                    <section key={r.id} className="space-y-2.5">
                      <div className="flex items-center gap-2.5 px-0.5">
                        {/* 分区色条（与 PC 端 5 套 accent 色系独立对应，不随用户主题色切换改变） */}
                        <span
                          className="w-1 h-5 rounded-full"
                          style={{
                            background:
                              r.id === 'dev'   ? 'linear-gradient(180deg,#A78BFA,#7C3AED)' :
                              r.id === 'ops'   ? 'linear-gradient(180deg,#10B981,#047857)' :
                              r.id === 'data'  ? 'linear-gradient(180deg,#22D3EE,#0E7490)' :
                              r.id === 'ai'    ? 'linear-gradient(180deg,#FB7185,#BE123C)' :
                                                 'linear-gradient(180deg,#67E8F9,#06B6D4)',
                          }}
                          aria-hidden
                        />
                        <h4 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--t-text-main)' }}>
                          {regionNameShort(r.id)}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold" style={{
                          backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 12%, transparent)',
                          color: 'var(--t-accent-600)',
                        }}>
                          {regCards.length}
                        </span>
                        {showExpandBtn && (
                          <button
                            onClick={() => toggleRegion(r.id)}
                            className="ml-auto text-[11px] flex items-center gap-0.5 px-2 py-1 rounded-lg transition-colors active:bg-[var(--t-bg)]"
                            style={{ color: expanded ? 'var(--t-text-mute)' : 'var(--t-accent-600)' }}
                          >
                            <span>{expanded ? '收起' : '全部'}</span>
                            <svg className="w-3 h-3 transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(90deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                        {visibleCards.map(renderCard)}
                      </div>
                    </section>
                  )
                })
              )}
            </div>
          </>
          )
        )}
      </main>

      <div className="hidden sm:block"><Footer /></div>
      <BottomTabBar
        view={view}
        onViewChange={handleViewChange}
        search={search}
        onSearchChange={setSearch}
        onShowTBD={(msg) => pushToast(msg, 'warn')}
      />
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
