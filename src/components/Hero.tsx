import type { PortalRegion } from '../data/portal'

interface HeroProps {
  regions: PortalRegion[]
  onRegionClick?: (id: string) => void
}

export default function Hero({ regions, onRegionClick }: HeroProps) {
  return (
    <section
      className="border-b"
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--t-accent-700) 92%, #000) 0%, color-mix(in srgb, var(--t-accent-800) 85%, #000) 100%)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-3 lg:px-5 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1 justify-end">
            {regions.map(r => (
              <button
                onClick={() => onRegionClick?.(r.id)}
                key={r.id}
                className="group inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all border backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(226,232,240,0.92)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                title={`${r.name}（${r.cards.length}）`}
              >
                <span className="text-xs leading-none">{r.icon}</span>
                <span className="hidden sm:inline">{r.name}</span>
                <span
                  className="px-1 py-px rounded text-[9px] group-hover:bg-white/20 leading-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(203,213,225,0.9)' }}
                >
                  {r.cards.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
