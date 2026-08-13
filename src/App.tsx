import { useState, useMemo, useEffect, useCallback } from 'react'
import { regions } from './data/portal'
import type { PortalRegion, PortalCard } from './data/portal'
import Header, { type ViewMode } from './components/Header'
import Hero from './components/Hero'
import RegionSection from './components/RegionSection'
import Footer from './components/Footer'
import PortalCardItem from './components/PortalCardItem'
import Toast, { type ToastItem } from './components/Toast'
import { useFavorites } from './hooks/useFavorites'
import { useCollapsedRegions } from './hooks/useCollapsedRegions'
import { useRecentVisit } from './hooks/useRecentVisit'
import { useScrollSpy } from './hooks/useScrollSpy'

export type AccentKey = 'blue' | 'emerald' | 'violet' | 'rose' | 'amber'
export type Mode = 'light' | 'dark'

const STORAGE_MODE = 'portal:theme-mode'
const STORAGE_ACCENT = 'portal:theme-accent'
const STORAGE_VIEW = 'portal:view-mode'

export default function App() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'overview'
    return (localStorage.getItem(STORAGE_VIEW) as ViewMode) || 'overview'
  })
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem(STORAGE_MODE) as Mode | null
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [accent, setAccent] = useState<AccentKey>(() => {
    if (typeof window === 'undefined') return 'blue'
    return (localStorage.getItem(STORAGE_ACCENT) as AccentKey) || 'blue'
  })
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()
  const { isCollapsed, toggle: toggleCollapsed } = useCollapsedRegions()
  const { recentIds, record: recordVisit } = useRecentVisit()

  const regionIds = useMemo(() => regions.map(r => r.id), [])
  const [spyActive] = useScrollSpy(regionIds, 108) // Hero(32) + Header(40) + ≈ padding(36)
  const [manualActive, setManualActive] = useState<string | undefined>(undefined)

  // 手动点击分区后，暂停 spy 高亮 700ms，避免 scrollIntoView 动画期间被下一个 section 覆盖
  useEffect(() => {
    if (!manualActive) return
    const t = setTimeout(() => setManualActive(undefined), 750)
    return () => clearTimeout(t)
  }, [manualActive])

  const regionAnchor = manualActive ?? spyActive

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

  useEffect(() => {
    localStorage.setItem(STORAGE_VIEW, view)
  }, [view])

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
    const result: PortalCard[] = []
    regions.forEach(r => r.cards.forEach(c => result.push(c)))
    return result
  }, [])

  const cardById = useMemo(() => {
    const map = new Map<number, PortalCard>()
    allCards.forEach(c => map.set(c.id, c))
    return map
  }, [allCards])

  const favoriteCards = useMemo<PortalCard[]>(() => {
    return favoriteIds
      .map(id => cardById.get(id))
      .filter((c): c is PortalCard => !!c)
  }, [favoriteIds, cardById])

  const recentCards = useMemo<PortalCard[]>(() => {
    return recentIds
      .map(id => cardById.get(id))
      .filter((c): c is PortalCard => !!c)
  }, [recentIds, cardById])

  const filteredRegions = useMemo<PortalRegion[]>(() => {
    if (!search.trim()) return regions
    const kw = search.trim().toLowerCase()
    return regions
      .map(r => {
        const cards: PortalCard[] = r.cards.filter(c =>
          c.title.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw) ||
          (c.tag ?? '').toLowerCase().includes(kw) ||
          r.name.toLowerCase().includes(kw),
        )
        return { ...r, cards }
      })
      .filter(r => r.cards.length > 0)
  }, [search])

  const globalMatches = useMemo<PortalCard[]>(() => {
    if (!search.trim()) return []
    const kw = search.trim().toLowerCase()
    const source =
      view === 'favorites' ? favoriteCards :
      view === 'recent'    ? recentCards    :
      allCards
    const result: PortalCard[] = []
    source.forEach(c => {
      if (
        (c.title.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw) ||
          (c.tag ?? '').toLowerCase().includes(kw)) &&
        !result.find(x => x.id === c.id)
      ) {
        result.push(c)
      }
    })
    return result
  }, [search, view, favoriteCards, recentCards, allCards])

  const filterByKeyword = (list: PortalCard[]) => {
    if (!search.trim()) return list
    const kw = search.trim().toLowerCase()
    return list.filter(c =>
      c.title.toLowerCase().includes(kw) ||
      c.description.toLowerCase().includes(kw) ||
      (c.tag ?? '').toLowerCase().includes(kw),
    )
  }

  const filteredFavorites = filterByKeyword(favoriteCards)
  const filteredRecent    = filterByKeyword(recentCards)

  const scrollToRegion = (id: string) => {
    setManualActive(id)
    const el = document.getElementById(`region-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  const showHero = !search.trim()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--t-bg)' }}>
      <Header
        search={search}
        setSearch={setSearch}
        mode={mode}
        onToggleMode={toggleMode}
        accent={accent}
        onChangeAccent={setAccent}
      />

      {showHero && (
        <Hero
          regions={regions}
          onRegionClick={scrollToRegion}
          activeId={regionAnchor}
          view={view}
          onViewChange={(v) => { setView(v); setManualActive(undefined) }}
          favoriteCount={favoriteIds.length}
          recentCount={recentIds.length}
        />
      )}

      <main
        className="max-w-[1600px] mx-auto px-2 lg:px-5 space-y-4 sm:space-y-5"
        style={{ paddingTop: showHero ? '10px' : '12px', paddingBottom: '12px' }}
      >
        {search.trim() ? (
          globalMatches.length === 0 ? (
            <EmptyState
              icon="🔍"
              title={
                <>
                  没有匹配 “<span style={{ color: 'var(--t-text-main)' }}>{search}</span>” 的系统
                </>
              }
              onClear={() => setSearch('')}
            />
          ) : (
            <section
              className="border rounded-lg p-2 sm:p-3"
              style={{
                borderColor: 'var(--t-border-sub)',
                background: `linear-gradient(135deg, var(--t-accent-50) 0%, var(--t-card) 50%, var(--t-accent-50) 100%)`,
              }}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--t-accent-600)' }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold" style={{ color: 'var(--t-text-main)' }}>
                    搜索 “<span style={{ color: 'var(--t-accent-600)' }}>{search}</span>” · {globalMatches.length} 个结果
                  </h3>
                </div>
                <button
                  onClick={() => setSearch('')}
                  className="text-[10px] px-1.5 py-0.5 rounded hover:bg-white/60 transition-colors"
                  style={{ color: 'var(--t-text-mute)' }}
                >
                  清空
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2.5">
                {globalMatches.map(renderCard)}
              </div>
            </section>
          )
        ) : view === 'favorites' ? (
          favoriteCards.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="暂无收藏"
              subtitle="点击卡片右上角的星星图标，将常用系统加入收藏"
              action={{ label: '返回总览', onClick: () => setView('overview'), variant: 'primary' }}
              iconSize="large"
              padding="large"
            />
          ) : (
            <ListSection
              title="我的收藏"
              count={filteredFavorites.length}
              accentIcon={
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              grid
            >
              {filteredFavorites.length === 0 ? (
                <EmptyInline message={`收藏中没有匹配 “${search}” 的结果`} onClear={() => setSearch('')} />
              ) : (
                filteredFavorites.map(renderCard)
              )}
            </ListSection>
          )
        ) : view === 'recent' ? (
          recentCards.length === 0 ? (
            <EmptyState
              icon="🕒"
              title="暂无访问记录"
              subtitle="点击进入任意系统，这里会显示最近访问过的 12 个系统"
              action={{ label: '去逛一逛', onClick: () => setView('overview'), variant: 'primary' }}
              iconSize="large"
              padding="large"
            />
          ) : (
            <ListSection
              title="最近访问"
              count={filteredRecent.length}
              accentIcon={
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              grid
            >
              {filteredRecent.length === 0 ? (
                <EmptyInline message={`最近访问中没有匹配 “${search}” 的结果`} onClear={() => setSearch('')} />
              ) : (
                filteredRecent.map(renderCard)
              )}
            </ListSection>
          )
        ) : (
          filteredRegions.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="没有找到匹配的系统"
              onClear={() => setSearch('')}
            />
          ) : (
            filteredRegions.map(r => (
              <RegionSection
                key={r.id}
                region={r}
                collapsed={isCollapsed(r.id)}
                onToggle={() => toggleCollapsed(r.id)}
              >
                {r.cards.map(renderCard)}
              </RegionSection>
            ))
          )
        )}
      </main>

      <Footer />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

/* ---------- 小组件 ---------- */

function EmptyState({
  icon, title, subtitle, onClear, action, iconSize = 'normal', padding = 'normal',
}: {
  icon: string
  title: React.ReactNode
  subtitle?: string
  onClear?: () => void
  action?: { label: string; onClick: () => void; variant: 'primary' | 'ghost' }
  iconSize?: 'normal' | 'large'
  padding?: 'normal' | 'large'
}) {
  return (
    <div
      className={`border rounded-lg flex flex-col items-center justify-center ${padding === 'large' ? 'py-16' : 'py-10'}`}
      style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
    >
      <div
        className={`rounded-full flex items-center justify-center mb-2.5 ${iconSize === 'large' ? 'w-14 h-14 text-3xl mb-3' : 'w-12 h-12 text-2xl'}`}
        style={{ backgroundColor: 'var(--t-border-sub)' }}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--t-text-sub)' }}>{title}</p>
      {subtitle && (
        <p className="text-[11px] mb-3" style={{ color: 'var(--t-text-mute)' }}>{subtitle}</p>
      )}
      {action ? (
        <button
          onClick={action.onClick}
          className="text-[11px] px-3 py-1 rounded font-medium transition-colors"
          style={
            action.variant === 'primary'
              ? { backgroundColor: 'var(--t-accent-600)', color: '#fff' }
              : { backgroundColor: 'transparent', color: 'var(--t-accent-600)' }
          }
          onMouseEnter={(e) => {
            if (action.variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--t-accent-700)'
          }}
          onMouseLeave={(e) => {
            if (action.variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--t-accent-600)'
          }}
        >
          {action.label}
        </button>
      ) : onClear ? (
        <button
          onClick={onClear}
          className="text-[11px] hover:underline mt-1"
          style={{ color: 'var(--t-accent-600)' }}
        >
          清除搜索
        </button>
      ) : null}
    </div>
  )
}

function EmptyInline({ message, onClear }: { message: string; onClear?: () => void }) {
  return (
    <div
      className="py-8 flex flex-col items-center justify-center col-span-full"
      style={{ color: 'var(--t-text-sub)' }}
    >
      <p className="text-[11px]">{message}</p>
      {onClear && (
        <button
          onClick={onClear}
          className="text-[11px] hover:underline mt-1"
          style={{ color: 'var(--t-accent-600)' }}
        >
          清除搜索
        </button>
      )}
    </div>
  )
}

function ListSection({
  title, count, accentIcon, children, grid,
}: {
  title: string
  count: number
  accentIcon: React.ReactNode
  children: React.ReactNode
  grid?: boolean
}) {
  return (
    <section
      className="border rounded-lg p-2 sm:p-3"
      style={{
        borderColor: 'var(--t-border-sub)',
        backgroundColor: 'var(--t-card)',
        borderLeftWidth: '3px',
        borderLeftColor: 'var(--t-accent-500)',
      }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))' }}
          >
            {accentIcon}
          </div>
          <h3 className="text-xs font-bold" style={{ color: 'var(--t-text-main)' }}>
            {title}
            <span
              className="ml-1.5 px-1.5 py-px text-[9px] font-bold rounded-full"
              style={{ backgroundColor: 'var(--t-accent-50)', color: 'var(--t-accent-700)' }}
            >
              {count}
            </span>
          </h3>
        </div>
      </div>
      {grid ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2.5">
          {children}
        </div>
      ) : children}
    </section>
  )
}
