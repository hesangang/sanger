import { useState, useEffect, useRef } from 'react'
import type { PortalCard } from '../data/Portal'
import {
  categoryLabel, categoryColor, iconText, simplifyTitle,
} from '../data/Portal'

interface PortalProps {
  card: PortalCard
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onVisit?: (id: number) => void
}

export default function Portal({ card, isFavorite, onToggleFavorite, onVisit }: PortalProps) {
  const { t: iconChar, bg: iconBg } = iconText(card.title, card.category)
  const catName = categoryLabel(card.category)
  const catStyle = categoryColor(card.category)
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

  const shortTitle = simplifyTitle(card.title)
  const iconSize = 'w-14 h-14'

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        e.currentTarget.style.setProperty('--t-card-hover-shadow', `0 10px 30px -12px color-mix(in srgb, var(--t-accent-500) 30%, transparent)`)
      }}
      onClick={() => onVisit?.(card.id)}
    >
      <div className="sm:hidden flex flex-col items-center gap-1.5 p-0.5">
        <div
          className={`${iconSize} flex-shrink-0 rounded-2xl flex items-center justify-center text-white font-black shadow-md relative overflow-hidden transition-transform group-active:scale-95`}
          style={{
            background: iconBg,
            fontSize: iconChar.length >= 3 ? '14px' : '20px',
            boxShadow: '0 4px 14px -6px color-mix(in srgb, #000 55%, transparent)',
          }}
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 30% 18%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)',
          }} />
          <span className="relative z-10 leading-none select-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
            {iconChar}
          </span>
        </div>
        <h3
          className="text-[11px] leading-tight font-medium text-center line-clamp-1 w-full truncate"
          style={{ color: 'var(--t-text-main)', minHeight: '16px' }}
          title={card.title}
        >
          {shortTitle}
        </h3>
      </div>

      <div
        className="hidden sm:block rounded-2xl p-5 border transition-all duration-200"
        style={{
          backgroundColor: 'var(--t-card)',
          borderColor: 'var(--t-border-sub)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--t-elev)'
          e.currentTarget.style.borderColor = 'var(--t-accent-500)'
          e.currentTarget.style.boxShadow = `0 10px 30px -12px color-mix(in srgb, var(--t-accent-500) 30%, transparent)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--t-card)'
          e.currentTarget.style.borderColor = 'var(--t-border-sub)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
            style={{
              width: '56px', height: '56px',
              background: iconBg,
              fontSize: iconChar.length >= 3 ? '15px' : '20px',
            }}
          >
            {iconChar}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[17px] truncate min-w-0" style={{ color: 'var(--t-text-main)' }}>
                {card.title}
              </h3>
              {card.tag && (
                <span
                  className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 15%, transparent)',
                    color: 'var(--t-accent-400)',
                  }}
                >
                  {card.tag}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--t-text-mute)' }}>
              {catName}
            </p>
          </div>
        </div>

        <p
          className="mt-3 text-[13px] leading-relaxed line-clamp-2"
          style={{ color: 'var(--t-text-sub)' }}
          title={card.description}
        >
          {card.description}
        </p>

        <div className="mt-4 pt-3.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite?.(card.id)
              }}
              className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${starPop ? 'animate-[star-pop_0.22s_cubic-bezier(0.34,1.56,0.64,1)_both]' : ''}`}
              style={{
                color: isFavorite ? 'var(--t-accent-500)' : 'var(--t-text-mute)',
              }}
              onMouseEnter={(e) => { if (!isFavorite) e.currentTarget.style.color = 'var(--t-text-sub)' }}
              onMouseLeave={(e) => { if (!isFavorite) e.currentTarget.style.color = 'var(--t-text-mute)' }}
              title={isFavorite ? '取消收藏' : '收藏该系统'}
              aria-pressed={!!isFavorite}
              aria-label={isFavorite ? '取消收藏' : '收藏该系统'}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isFavorite ? 0 : 1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>{isFavorite ? '已收藏' : '收藏'}</span>
            </button>
            <span style={{ color: 'var(--t-border-main)' }} className="hidden sm:inline">·</span>
            <div className="hidden sm:flex items-center gap-1.5" style={{ color: 'var(--t-text-mute)' }}>
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isFavorite ? 'var(--t-accent-500)' : 'var(--t-status-mute)',
                  opacity: isFavorite ? 1 : 0.55,
                }}
              />
              <span className="text-[12px]">{isFavorite ? '常用' : '未收藏'}</span>
            </div>
          </div>

          <div
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: '32px', height: '32px',
              backgroundColor: 'transparent',
              color: 'var(--t-text-mute)',
            }}
          >
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div
          className="absolute top-3 right-3 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"
          style={{
            backgroundColor: catStyle.bg,
            color: '#fff',
          }}
        >
          {catName}
        </div>
      </div>
    </a>
  )
}
