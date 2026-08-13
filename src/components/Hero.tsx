import type { PortalRegion } from '../data/portal'
import type { ViewMode } from './Header'

interface HeroProps {
  regions: PortalRegion[]
  onRegionClick?: (id: string) => void
  activeId?: string
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  favoriteCount: number
  recentCount: number
}

const regionName = (id: string) =>
  id === 'dev' ? '研发效能'
  : id === 'ops' ? '运维监控'
  : id === 'data' ? '数据分析'
  : id === 'ai' ? 'AI 能力'
  : id === 'office' ? '办公协作'
  : id === 'cloud' ? '云服务' : id

const regionIconShort: Record<string, string> = {
  dev: '⚙', ops: '📊', data: '📈', ai: '🤖', office: '📇', cloud: '☁',
}

type NavItem =
  | { id: string; name: string; icon: string; type: 'region'; count: number }
  | { id: ViewMode; name: string; icon: string; type: 'view'; count: number }

export default function Hero({
  regions, onRegionClick, activeId, view, onViewChange, favoriteCount, recentCount,
}: HeroProps) {
  const regionItems: NavItem[] = regions.map(r => ({
    id: r.id, name: regionName(r.id), icon: regionIconShort[r.id] ?? '▫', type: 'region', count: r.cards.length,
  }))
  const viewItems: NavItem[] = [
    { id: 'overview',  name: '总览',     icon: '🏠', type: 'view', count: regions.reduce((s, r) => s + r.cards.length, 0) },
    { id: 'recent',    name: '最近访问', icon: '🕒', type: 'view', count: recentCount },
    { id: 'favorites', name: '我的收藏', icon: '⭐', type: 'view', count: favoriteCount },
  ]

  return (
    <div
      className="sticky z-40 border-b"
      style={{
        top: '40px',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--t-accent-700) 92%, #000) 0%, color-mix(in srgb, var(--t-accent-800) 85%, #000) 100%)',
        borderColor: 'rgba(0,0,0,0.12)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-2 lg:px-5 py-1.5">
        <div className="flex items-center gap-1 min-h-[26px] min-w-0">
          {/* 左侧左对齐：总览 / 最近访问 / 我的收藏 */}
          <div className="flex overflow-x-auto scrollbar-hide gap-1 min-w-0 flex-shrink-0">
            {viewItems.map(item => {
              const isActive = view === item.id
              return (
                <button
                  onClick={() => {
                    onViewChange(item.id as ViewMode)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  key={item.id}
                  className={`group relative inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[11px] font-medium transition-all border backdrop-blur-sm whitespace-nowrap flex-shrink-0`}
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    borderColor: isActive
                      ? 'rgba(255,255,255,0.22)'
                      : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#fff' : 'rgba(226,232,240,0.9)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }
                  }}
                  title={`${item.name}（${item.count}）`}
                  aria-label={item.name}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full hidden lg:block"
                      style={{
                        width: 'calc(100% - 12px)',
                        backgroundColor: 'var(--t-accent-200)',
                        boxShadow: '0 1px 6px 0 color-mix(in srgb, var(--t-accent-300) 60%, transparent)',
                      }}
                    />
                  )}
                  <span className="text-[11px] sm:text-xs leading-none">{item.icon}</span>
                  <span className="hidden sm:inline lg:inline-block">{item.name}</span>
                  <span
                    className="px-0.5 sm:px-1 rounded text-[8px] sm:text-[9px] leading-none"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.26)'
                        : 'color-mix(in srgb, var(--t-accent-500) 55%, transparent)',
                      color: isActive ? 'rgba(255,255,255,0.98)' : '#fff',
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 中间留空 */}
          <div className="flex-1 min-w-[4px]" />

          {/* 右侧右对齐：6 个分区 */}
          <div className="flex overflow-x-auto scrollbar-hide gap-1 min-w-0 flex-shrink-0 justify-end">
            {regionItems.map(item => {
              const isActive = view === 'overview' && activeId === item.id
              return (
                <button
                  onClick={() => {
                    if (view !== 'overview') onViewChange('overview')
                    onRegionClick?.(item.id)
                  }}
                  key={item.id}
                  className={`group relative inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[11px] font-medium transition-all border backdrop-blur-sm whitespace-nowrap flex-shrink-0`}
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    borderColor: isActive
                      ? 'rgba(255,255,255,0.22)'
                      : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#fff' : 'rgba(226,232,240,0.9)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }
                  }}
                  title={`${item.name}（${item.count}）`}
                  aria-label={item.name}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full hidden lg:block"
                      style={{
                        width: 'calc(100% - 12px)',
                        backgroundColor: 'var(--t-accent-200)',
                        boxShadow: '0 1px 6px 0 color-mix(in srgb, var(--t-accent-300) 60%, transparent)',
                      }}
                    />
                  )}
                  <span className="text-[11px] sm:text-xs leading-none">{item.icon}</span>
                  <span className="hidden sm:inline lg:inline-block">{item.name}</span>
                  <span
                    className="px-0.5 sm:px-1 rounded text-[8px] sm:text-[9px] leading-none"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.22)'
                        : 'rgba(255,255,255,0.08)',
                      color: isActive
                        ? 'rgba(255,255,255,0.98)'
                        : 'rgba(203,213,225,0.92)',
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
