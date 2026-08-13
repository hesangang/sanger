import { useState, useMemo, useEffect } from 'react'
import { regions } from './data/portal'
import type { PortalRegion, PortalCard } from './data/portal'
import Header, { type ViewMode } from './components/Header'
import Hero from './components/Hero'
import RegionSection from './components/RegionSection'
import Footer from './components/Footer'
import PortalCardItem from './components/PortalCardItem'
import { useFavorites } from './hooks/useFavorites'

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

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()

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
    const source = view === 'favorites' ? favoriteCards : allCards
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
    return result.slice(0, 12)
  }, [search, view, favoriteCards, allCards])

  const filteredFavorites = useMemo<PortalCard[]>(() => {
    if (!search.trim()) return favoriteCards
    const kw = search.trim().toLowerCase()
    return favoriteCards.filter(c =>
      c.title.toLowerCase().includes(kw) ||
      c.description.toLowerCase().includes(kw) ||
      (c.tag ?? '').toLowerCase().includes(kw),
    )
  }, [favoriteCards, search])

  const scrollToRegion = (id: string) => {
    const el = document.getElementById(`region-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--t-bg)' }}>
      <Header
        search={search}
        setSearch={setSearch}
        regionIds={regions.map(r => r.id)}
        onRegionClick={scrollToRegion}
        mode={mode}
        onToggleMode={toggleMode}
        accent={accent}
        onChangeAccent={setAccent}
        view={view}
        onViewChange={setView}
        favoriteCount={favoriteIds.length}
      />

      {view === 'overview' && (
        <Hero
          regions={regions}
          onRegionClick={scrollToRegion}
        />
      )}

      <main className="max-w-[1600px] mx-auto px-3 lg:px-5 py-3 space-y-5">
        {globalMatches.length > 0 && search.trim() && (
          <section
            className="border rounded-lg p-3"
            style={{
              borderColor: 'var(--t-border-sub)',
              background: `linear-gradient(135deg, var(--t-accent-50) 0%, var(--t-card) 50%, var(--t-accent-50) 100%)`,
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {globalMatches.map(card => (
                <PortalCardItem
                  key={card.id}
                  card={card}
                  isFavorite={isFavorite(card.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {view === 'favorites' ? (
          favoriteCards.length === 0 ? (
            <div
              className="border rounded-lg py-16 flex flex-col items-center justify-center"
              style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3"
                style={{ backgroundColor: 'var(--t-border-sub)' }}
              >
                ⭐
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--t-text-main)' }}>暂无收藏</p>
              <p className="text-xs mb-3" style={{ color: 'var(--t-text-sub)' }}>
                点击卡片右上角的星星图标，将常用系统加入收藏
              </p>
              <button
                onClick={() => setView('overview')}
                className="text-[11px] px-3 py-1 rounded font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--t-accent-600)',
                  color: '#fff',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--t-accent-700)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--t-accent-600)')}
              >
                返回总览
              </button>
            </div>
          ) : (
            <section
              className="border rounded-lg p-3"
              style={{
                borderColor: 'var(--t-border-sub)',
                backgroundColor: 'var(--t-card)',
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))',
                    }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold" style={{ color: 'var(--t-text-main)' }}>
                    我的收藏
                    <span
                      className="ml-1.5 px-1.5 py-px text-[9px] font-bold rounded-full"
                      style={{
                        backgroundColor: 'var(--t-accent-50)',
                        color: 'var(--t-accent-700)',
                      }}
                    >
                      {filteredFavorites.length}
                    </span>
                  </h3>
                </div>
                {filteredFavorites.length > 0 && search.trim() && (
                  <button
                    onClick={() => setSearch('')}
                    className="text-[10px] px-1.5 py-0.5 rounded hover:bg-white/60 transition-colors"
                    style={{ color: 'var(--t-text-mute)' }}
                  >
                    清空搜索
                  </button>
                )}
              </div>
              {filteredFavorites.length === 0 && search.trim() ? (
                <div
                  className="py-8 flex flex-col items-center justify-center"
                  style={{ color: 'var(--t-text-sub)' }}
                >
                  <p className="text-[11px]">收藏中没有匹配 “{search}” 的结果</p>
                  <button
                    onClick={() => setSearch('')}
                    className="text-[11px] hover:underline mt-1"
                    style={{ color: 'var(--t-accent-600)' }}
                  >
                    清除搜索
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {filteredFavorites.map(card => (
                    <PortalCardItem
                      key={card.id}
                      card={card}
                      isFavorite={isFavorite(card.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        ) : (
          filteredRegions.length === 0 ? (
            <div
              className="border rounded-lg py-10 flex flex-col items-center justify-center"
              style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2.5"
                style={{ backgroundColor: 'var(--t-border-sub)' }}
              >
                🔍
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--t-text-sub)' }}>没有找到匹配的系统</p>
              <button
                onClick={() => setSearch('')}
                className="text-[11px] hover:underline mt-1"
                style={{ color: 'var(--t-accent-600)' }}
              >
                清除搜索
              </button>
            </div>
          ) : (
            filteredRegions.map(r => (
              <RegionSection key={r.id} region={r}>
                {r.cards.map(card => (
                  <PortalCardItem
                    key={card.id}
                    card={card}
                    isFavorite={isFavorite(card.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </RegionSection>
            ))
          )
        )}
      </main>

      <Footer />
    </div>
  )
}
