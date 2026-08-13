import { useState, useEffect, useRef } from 'react'
import type { PortalCard } from '../data/portal'

interface PortalCardItemProps {
  card: PortalCard
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
}

const tagAccentStyle = () => {
  return {
    backgroundColor: 'color-mix(in srgb, var(--t-accent-50) 80%, #fff)',
    color: 'var(--t-accent-700)',
    borderColor: 'color-mix(in srgb, var(--t-accent-200) 70%, #fff)',
  }
}

const gradients = [
  'from-slate-700 via-blue-600 to-indigo-800',
  'from-emerald-700 via-teal-600 to-cyan-800',
  'from-violet-700 via-purple-600 to-fuchsia-800',
  'from-rose-700 via-pink-600 to-red-700',
  'from-amber-600 via-orange-600 to-red-700',
  'from-cyan-600 via-sky-600 to-blue-800',
]

const regionIconMap: Record<string, string> = {
  dev: '⚙️',
  ops: '📊',
  data: '📈',
  ai: '🤖',
  office: '📇',
  cloud: '☁️',
}

export default function PortalCardItem({ card, isFavorite, onToggleFavorite, onVisit }: PortalCardItemProps & { onVisit?: (id: number) => void }) {
  const gradient = gradients[card.id % gradients.length]
  const regionIcon = regionIconMap[card.category] ?? '🖥️'
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [starPop, setStarPop] = useState(false)
  const prevFav = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    if (prevFav.current !== undefined && prevFav.current !== isFavorite && isFavorite) {
      setStarPop(true)
      const t = setTimeout(() => setStarPop(false), 220)
      return () => clearTimeout(t)
    }
    prevFav.current = isFavorite
  }, [isFavorite])

  const showPlaceholder = !imgLoaded || imgFailed

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-md sm:rounded-lg border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      style={{
        backgroundColor: 'var(--t-card)',
        borderColor: 'var(--t-border-sub)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--t-accent-400)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--t-border-sub)' }}
      onClick={() => onVisit?.(card.id)}
    >
      <div className={`relative overflow-hidden aspect-video ${!imgLoaded || imgFailed ? `bg-gradient-to-br ${gradient}` : ''}`}>
        {showPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-base sm:text-lg shadow-lg mb-0.5 sm:mb-1">
              {regionIcon}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:14px_14px] sm:bg-[size:18px_18px] opacity-50"></div>
          </div>
        ) : null}

        <img
          src={card.cover}
          alt={card.title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-500 ${showPlaceholder ? 'opacity-0 scale-105 absolute inset-0' : 'opacity-100 scale-100 group-hover:scale-105'}`}
          onLoad={() => { if (!imgFailed) setImgLoaded(true) }}
          onError={() => { setImgFailed(true); setImgLoaded(false) }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none"></div>

        {card.tag && (
          <div className="absolute top-1 left-1 z-10">
            <span
              className="px-1 py-px text-[8px] sm:px-1.5 sm:py-0.5 sm:text-[9px] font-semibold rounded border backdrop-blur-sm shadow-sm"
              style={tagAccentStyle()}
            >
              {card.tag}
            </span>
          </div>
        )}

        <div className="absolute top-1 right-1 z-10">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite?.(card.id)
            }}
            className={`rounded-full flex items-center justify-center backdrop-blur-sm border transition-all hover:scale-110 ${starPop ? 'animate-[star-pop_0.22s_cubic-bezier(0.34,1.56,0.64,1)_both]' : ''}`}
            style={{
              width: '20px', height: '20px',
              backgroundColor: isFavorite ? 'color-mix(in srgb, var(--t-accent-500) 90%, #fff)' : 'rgba(0,0,0,0.25)',
              borderColor: isFavorite ? 'var(--t-accent-400)' : 'rgba(255,255,255,0.15)',
              color: isFavorite ? '#fff' : 'rgba(255,255,255,0.7)',
            }}
            title={isFavorite ? '取消收藏' : '收藏'}
            aria-pressed={!!isFavorite}
            aria-label={isFavorite ? '取消收藏' : '加入收藏'}
          >
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFavorite ? 0 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>

        {!imgLoaded && !imgFailed && !card.tag && (
          <div className="absolute top-1 left-1 z-10">
            <span className="px-1 py-0.5 text-[8px] font-medium text-white/80 rounded bg-black/25 backdrop-blur-sm border border-white/10 animate-pulse">·</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-1.5 sm:px-2 py-1 sm:py-1.5 z-10">
          <h3 className="text-[10px] sm:text-[12px] font-semibold text-white drop-shadow truncate">{card.title}</h3>
        </div>
      </div>

      <div className="px-1.5 sm:px-2 py-1 sm:py-1.5">
        <p
          className="text-[10px] sm:text-[11px] leading-snug line-clamp-2"
          style={{ color: 'var(--t-text-sub)' }}
          title={card.description}
        >
          {card.description}
        </p>
      </div>
    </a>
  )
}
