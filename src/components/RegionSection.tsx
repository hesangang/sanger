import type { ReactNode } from 'react'
import type { PortalRegion, PortalCard } from '../data/portal'
import PortalCardItem from './PortalCardItem'

interface RegionSectionProps {
  region: PortalRegion
  collapsed?: boolean
  onToggle?: () => void
  children?: ReactNode
}

export default function RegionSection({ region, collapsed, onToggle, children }: RegionSectionProps) {
  const hasChildren = children !== undefined
  const cardCount = hasChildren
    ? (Array.isArray(children) ? children.length : 1)
    : region.cards.length

  return (
    <section id={`region-${region.id}`} className="scroll-mt-16">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm flex-shrink-0 bg-gradient-to-br ${region.gradient}`}
          >
            {region.icon}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-sm font-bold tracking-tight" style={{ color: 'var(--t-text-main)' }}>{region.name}</h2>
            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
              style={{
                backgroundColor: 'var(--t-accent-50)',
                color: 'var(--t-accent-700)',
              }}
            >
              {cardCount}
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded flex items-center justify-center transition-all flex-shrink-0"
          style={{ color: 'var(--t-text-mute)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--t-border-sub)'
            e.currentTarget.style.color = 'var(--t-text-sub)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--t-text-mute)'
          }}
          aria-label={collapsed ? '展开分区' : '折叠分区'}
          title={collapsed ? '展开分区' : '折叠分区'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div
        className={`transition-[max-height,opacity,margin] duration-300 ease-out overflow-hidden ${
          collapsed ? 'max-h-0 opacity-0 mt-0' : 'opacity-100 mt-0'
        }`}
        style={{ maxHeight: collapsed ? '0px' : '3000px' }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
          {hasChildren
            ? children
            : region.cards.map((card: PortalCard) => (
                <PortalCardItem key={card.id} card={card} />
              ))}
        </div>
      </div>
    </section>
  )
}
