import { useState, useEffect } from 'react'
import type { PortalCard } from '../data/portal'

interface PortalCardItemProps {
  card: PortalCard
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

export default function PortalCardItem({ card }: PortalCardItemProps) {
  const gradient = gradients[card.id % gradients.length]
  const regionIcon = regionIconMap[card.category] ?? '🖥️'
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgLoaded(false)
    setImgFailed(false)
    const probe = new Image()
    probe.onload = () => setImgLoaded(true)
    probe.onerror = () => setImgFailed(true)
    probe.src = card.cover
    return () => { probe.onload = null; probe.onerror = null }
  }, [card.cover])

  const showPlaceholder = imgFailed || !imgLoaded

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-lg border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      style={{
        backgroundColor: 'var(--t-card)',
        borderColor: 'var(--t-border-sub)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--t-accent-400)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--t-border-sub)' }}
    >
      <div className={`relative overflow-hidden aspect-video ${!imgLoaded || imgFailed ? `bg-gradient-to-br ${gradient}` : ''}`}>
        {showPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg shadow-lg mb-1">
              {regionIcon}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:18px_18px] opacity-50"></div>
          </div>
        ) : (
          <img
            src={card.cover}
            alt={card.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none"></div>

        {card.tag && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span
              className="px-1.5 py-0.5 text-[9px] font-semibold rounded border backdrop-blur-sm shadow-sm"
              style={tagAccentStyle()}
            >
              {card.tag}
            </span>
          </div>
        )}

        {!imgLoaded && !imgFailed && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <span className="px-1.5 py-0.5 text-[9px] font-medium text-white/80 rounded bg-black/25 backdrop-blur-sm border border-white/10 animate-pulse">·</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 z-10">
          <h3 className="text-[12px] font-bold text-white drop-shadow truncate">{card.title}</h3>
        </div>
      </div>

      <div className="px-2 py-1.5">
        <p
          className="text-[11px] leading-snug line-clamp-2"
          style={{ color: 'var(--t-text-sub)' }}
          title={card.description}
        >
          {card.description}
        </p>
      </div>
    </a>
  )
}
