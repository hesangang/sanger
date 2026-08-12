import type { PortalRegion } from '../data/portal'
import PortalCardItem from './PortalCardItem'

interface RegionSectionProps {
  region: PortalRegion
}

export default function RegionSection({ region }: RegionSectionProps) {
  return (
    <section id={`region-${region.id}`} className="scroll-mt-16">
      <div className="flex items-center justify-between mb-2.5">
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
              style={{ backgroundColor: 'var(--t-border-sub)', color: 'var(--t-text-mute)' }}
            >
              {region.cards.length}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {region.cards.map(card => (
          <PortalCardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
