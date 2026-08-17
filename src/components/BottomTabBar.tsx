import { useState, useEffect, useRef } from 'react'
import type { ViewMode } from '../App'
import type { PortalCard } from '../data/portal'

type TabId = 'console' | 'apps' | 'board' | 'mine'

interface BottomTabBarProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onMine?: () => void
  onShowTBD?: (msg: string) => void
  search?: string
  onSearchChange?: (v: string) => void
  hideGlobalSearch?: boolean
  searchPlaceholder?: string
  searchHints?: string[]
  spotlightApps?: PortalCard[]
  onOpenApp?: (card: PortalCard) => void
  onExpandedChange?: (expanded: boolean) => void
}

const TABS: {
  id: TabId
  label: string
  icon: (active: boolean) => React.ReactNode
}[] = [
  {
    id: 'console',
    label: '首页',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'apps',
    label: '管理',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'board',
    label: '看板',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    id: 'mine',
    label: '我的',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const categoryColor = (c: string): { bg: string; fg: string } => {
  switch (c) {
    case 'dev':    return { bg: 'linear-gradient(135deg,#38BDF8,#0284C7)', fg: '#0C4A6E' }
    case 'ops':    return { bg: 'linear-gradient(135deg,#34D399,#047857)', fg: '#064E3B' }
    case 'data':   return { bg: 'linear-gradient(135deg,#22D3EE,#0891B2)', fg: '#164E63' }
    case 'ai':     return { bg: 'linear-gradient(135deg,#F472B6,#BE185D)', fg: '#831843' }
    case 'cloud':  return { bg: 'linear-gradient(135deg,#818CF8,#4338CA)', fg: '#312E81' }
    default:       return { bg: 'linear-gradient(135deg,#94A3B8,#475569)', fg: '#1E293B' }
  }
}

const cardIdGradient = (_id: number) => {
  const palette = [
    'linear-gradient(135deg,#22C55E,#15803D)',
    'linear-gradient(135deg,#EF4444,#B91C1C)',
    'linear-gradient(135deg,#111827,#0B0F17)',
    'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    'linear-gradient(135deg,#F59E0B,#B45309)',
    'linear-gradient(135deg,#8B5CF6,#6D28D9)',
    'linear-gradient(135deg,#EC4899,#BE185D)',
    'linear-gradient(135deg,#14B8A6,#0F766E)',
  ]
  return palette[_id % palette.length]
}

const iconText = (title: string, _category: string) => {
  if (title.includes('GitLab')) return { t: 'GL', bg: categoryColor('dev').bg }
  if (title.includes('Bruno')) return { t: 'Br', bg: 'linear-gradient(135deg,#1E1B4B,#0F172A)' }
  if (title.includes('Jenkins')) return { t: 'Jk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Sonar')) return { t: 'Sq', bg: 'linear-gradient(135deg,#34D399,#047857)' }
  if (title.includes('Nexus')) return { t: 'Nx', bg: 'linear-gradient(135deg,#60A5FA,#1D4ED8)' }
  if (title.includes('Sentry')) return { t: 'Se', bg: 'linear-gradient(135deg,#9C27B0,#360D3B)' }
  if (title.includes('Mattermost')) return { t: 'Mm', bg: 'linear-gradient(135deg,#0058CC,#002D6E)' }
  if (title.includes('Grafana') && title.includes('k6')) return { t: 'k6', bg: 'linear-gradient(135deg,#7B217F,#3C0D3D)' }
  if (title.includes('Grafana') && title.includes('Beyla')) return { t: 'Gb', bg: 'linear-gradient(135deg,#10B981,#064E3B)' }
  if (title.includes('Grafana') && title.includes('Tempo')) return { t: 'Gt', bg: 'linear-gradient(135deg,#F97316,#7C2D12)' }
  if (title.includes('Grafana') && title.includes('Mimir')) return { t: 'Gm', bg: 'linear-gradient(135deg,#16A34A,#064E3B)' }
  if (title.includes('Grafana')) return { t: 'Gf', bg: categoryColor('ops').bg }
  if (title.includes('Kuber')) return { t: 'K8', bg: 'linear-gradient(135deg,#60A5FA,#2563EB)' }
  if (title.includes('OpenTel') || title.includes('OTel')) return { t: 'OT', bg: 'linear-gradient(135deg,#000000,#1F2937)' }
  if (title.includes('Jaeger')) return { t: 'Jg', bg: 'linear-gradient(135deg,#6366F1,#312E81)' }
  if (title.includes('Loki')) return { t: 'Lk', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' }
  if (title.includes('Argo')) return { t: 'Ar', bg: 'linear-gradient(135deg,#6366F1,#4338CA)' }
  if (title.includes('Nacos')) return { t: 'Na', bg: 'linear-gradient(135deg,#10B981,#065F46)' }
  if (title.includes('Vault')) return { t: 'Va', bg: 'linear-gradient(135deg,#111827,#000000)' }
  if (title.includes('Metabase')) return { t: 'Mb', bg: categoryColor('data').bg }
  if (title.includes('Superset')) return { t: 'Ss', bg: 'linear-gradient(135deg,#14B8A6,#0F766E)' }
  if (title.includes('Dolphin')) return { t: 'Ds', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('ClickHouse') || title.includes('Click')) return { t: 'CH', bg: 'linear-gradient(135deg,#FFCC00,#B45309)' }
  if (title.includes('Doris')) return { t: 'Dr', bg: 'linear-gradient(135deg,#1E40AF,#002075)' }
  if (title.includes('Flink')) return { t: 'Fk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Kylin')) return { t: 'Ky', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('dbt')) return { t: 'dt', bg: 'linear-gradient(135deg,#FF6B6B,#B91C1C)' }
  if (title.includes('Airbyte')) return { t: 'Ab', bg: 'linear-gradient(135deg,#615EFC,#4338CA)' }
  if (title.includes('SeaTunnel') || title.includes('Tunnel')) return { t: 'ST', bg: categoryColor('data').bg }
  if (title.includes('DataX')) return { t: 'DX', bg: 'linear-gradient(135deg,#FF6A00,#B45309)' }
  if (title.includes('Hue')) return { t: 'Hu', bg: categoryColor('data').bg }
  if (title.includes('大模型') || title.includes('LLM') || title.includes('推理')) return { t: 'AI', bg: categoryColor('ai').bg }
  if (title.includes('Midjour')) return { t: 'Mj', bg: categoryColor('ai').bg }
  if (title.includes('Milvus')) return { t: 'Mv', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }
  if (title.includes('Ollama')) return { t: 'Ol', bg: 'linear-gradient(135deg,#000000,#1F2937)' }
  if (title.includes('ComfyUI')) return { t: 'Cf', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' }
  if (title.includes('LangChain') || title.includes('Lang')) return { t: 'Lc', bg: 'linear-gradient(135deg,#1C3F39,#000000)' }
  if (title.includes('Suno')) return { t: 'Sn', bg: 'linear-gradient(135deg,#000000,#7C2D12)' }
  if (title.includes('Cursor')) return { t: 'Cr', bg: 'linear-gradient(135deg,#1E293B,#000000)' }
  if (title.includes('Stable Diffusion') || title.includes('WebUI')) return { t: 'SD', bg: 'linear-gradient(135deg,#A855F7,#4C1D95)' }
  if (title.includes('OCR')) return { t: 'OR', bg: 'linear-gradient(135deg,#22D3EE,#0891B2)' }
  if (title.includes('ASR') || title.includes('Whisper')) return { t: 'SR', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }
  if (title.includes('Dify')) return { t: 'Df', bg: categoryColor('ai').bg }
  if (title.includes('阿里')) return { t: '阿', bg: 'linear-gradient(135deg,#FB923C,#C2410C)' }
  if (title.includes('腾讯')) return { t: '腾', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('华为')) return { t: '华', bg: 'linear-gradient(135deg,#EF4444,#991B1B)' }
  if (title.includes('MinIO')) return { t: 'M', bg: 'linear-gradient(135deg,#EF4444,#B91C1C)' }
  if (title.includes('Harbor')) return { t: 'H', bg: categoryColor('cloud').bg }
  if (title.includes('DNS') || title.includes('域名')) return { t: 'NS', bg: 'linear-gradient(135deg,#10B981,#047857)' }
  return {
    t: title.slice(0, 2).toUpperCase().replace(/[^A-Z0-9\u4e00-\u9fa5]/g, '').slice(0, 2) || '◆',
    bg: cardIdGradient(Number(title.length + title.charCodeAt(0))),
  }
}

const simplifyTitle = (t: string): string => {
  const exactMap: [RegExp, string][] = [
    [/^GitLab\b/i, 'GitLab'], [/^Bruno\b/i, 'Bruno'], [/^Jenkins\b/i, 'Jenkins'],
    [/SonarQube/i, 'SonarQube'], [/k6/i, 'k6'], [/Nexus/i, 'Nexus'],
    [/Sentry/i, 'Sentry'], [/Mattermost/i, 'Mattermost'], [/Grafana\s*Beyla/i, 'Beyla'],
    [/Grafana\s*Tempo/i, 'Tempo'], [/Grafana\s*Mimir/i, 'Mimir'], [/^Grafana\b/i, 'Grafana'],
    [/Kubernetes/i, 'K8s'], [/OpenTelemetry/i, 'OpenTel'], [/Jaeger/i, 'Jaeger'],
    [/^Loki\b/i, 'Loki'], [/^Vector\b/i, 'Vector'], [/Argo\s*CD/i, 'Argo CD'],
    [/Nacos/i, 'Nacos'], [/Vault/i, 'Vault'], [/Metabase/i, 'Metabase'],
    [/Superset/i, 'Superset'], [/DolphinScheduler/i, 'Dolphin'], [/ClickHouse/i, 'ClickHouse'],
    [/Doris/i, 'Doris'], [/^Flink\b/i, 'Flink'], [/Kylin/i, 'Kylin'], [/^dbt\b/i, 'dbt'],
    [/Airbyte/i, 'Airbyte'], [/SeaTunnel/i, 'SeaTunnel'], [/DataX/i, 'DataX'], [/^Hue\b/i, 'Hue'],
    [/Midjourney/i, 'Midjourney'], [/Milvus/i, 'Milvus'], [/Ollama/i, 'Ollama'],
    [/ComfyUI/i, 'ComfyUI'], [/LangChain/i, 'LangChain'], [/^Suno\b/i, 'Suno'],
    [/^Cursor\b/i, 'Cursor'], [/Stable\s*Diffusion/i, 'SD WebUI'], [/Tesseract/i, 'Tesseract'],
    [/Whisper/i, 'Whisper'], [/^Dify\b/i, 'Dify'], [/MinIO/i, 'MinIO'], [/Harbor/i, 'Harbor'],
    [/^DNS\b/i, 'DNS'], [/大模型推理网关/i, 'LLM 网关'], [/阿里云控制台/i, '阿里云'],
    [/腾讯云控制台/i, '腾讯云'], [/华为云控制台/i, '华为云'],
  ]
  for (const [re, val] of exactMap) if (re.test(t)) return val
  const m = t.match(/^[A-Za-z][A-Za-z0-9.\-+_ ]{0,12}[A-Za-z0-9]?/)
  return m ? m[0].trim() : t
}

export default function BottomTabBar({
  view, onViewChange, onMine, onShowTBD,
  search = '', onSearchChange, hideGlobalSearch = false,
  searchPlaceholder = '搜索系统、名称、功能…',
  searchHints = [],
  spotlightApps = [],
  onOpenApp,
  onExpandedChange,
}: BottomTabBarProps) {
  const [expanded, setExpandedState] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)

  const setExpanded = (v: boolean) => {
    setExpandedState(v)
    onExpandedChange?.(v)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    setViewportHeight(window.visualViewport?.height ?? window.innerHeight)
    const vv = window.visualViewport
    const onResize = () => {
      setViewportHeight(vv?.height ?? window.innerHeight)
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
        }
      })
    }
    if (vv) {
      vv.addEventListener('resize', onResize)
      vv.addEventListener('scroll', onResize)
    }
    window.addEventListener('resize', onResize)
    return () => {
      if (vv) {
        vv.removeEventListener('resize', onResize)
        vv.removeEventListener('scroll', onResize)
      }
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (expanded && scrollRef.current) {
      const t = setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight
      }, 60)
      return () => clearTimeout(t)
    }
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const getActiveId = (): TabId => {
    if (view === 'mine') return 'mine'
    if (view === 'system') return 'apps'
    // 移动端 APP：全量系统卡片（overview）属于「首页」，无论 overview/favorites/recent 都让首页高亮
    return 'console'
  }
  const activeId = getActiveId()

  const handleClick = (id: TabId) => {
    if (expanded) return
    if (id === 'console') {
      // 首页 Tab → 直接显示全量系统卡片 overview（不再 favorites 空态）
      onViewChange('overview')
    } else if (id === 'apps') {
      // 管理 Tab → 进入管理中心（与 PC 端一致）
      onViewChange('system')
    } else if (id === 'board') {
      // 看板页 - 对应 PC 端「数据看板」，待开发 TBD
      onShowTBD?.('「数据看板」功能开发中，敬请期待')
    } else if (id === 'mine') {
      onMine ? onMine() : onViewChange('mine')
    }
  }

  const safeTop = 'env(safe-area-inset-top, 12px)'
  const safeBottom = 'env(safe-area-inset-bottom, 0px)'
  const searchBarEstimate = 72
  const headerEstimate = 56
  const minHintArea = 140

  const kw = search.trim().toLowerCase()
  const filteredSpotlight = (spotlightApps ?? []).filter(c =>
    !kw ||
    c.title.toLowerCase().includes(kw) ||
    c.description.toLowerCase().includes(kw) ||
    (c.tag ?? '').toLowerCase().includes(kw)
  )

  const layoutHintsMinHeight = viewportHeight
    ? Math.max(minHintArea, viewportHeight - searchBarEstimate - headerEstimate)
    : minHintArea

  return (
    <>
      <div
        className="sm:hidden fixed inset-0 z-[60] flex flex-col"
        style={{
          backgroundColor: 'var(--t-bg)',
          height: viewportHeight ? `${viewportHeight}px` : '100vh',
          maxHeight: viewportHeight ? `${viewportHeight}px` : '100vh',
          visibility: expanded ? 'visible' : 'hidden',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 150ms ease-out',
          pointerEvents: expanded ? 'auto' : 'none',
        }}
        onClick={() => setExpanded(false)}
      >
          <div className="flex-shrink-0 px-4 pt-2 flex items-center justify-between"
            style={{ paddingTop: safeTop, minHeight: `${headerEstimate}px` }}
            onClick={(e) => e.stopPropagation()}>
            {filteredSpotlight.length > 0 && !kw && (
              <div className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-lg"
                style={{
                  color: 'var(--t-text-sub)',
                  backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 10%, transparent)',
                }}>
                ★ 最佳搜索
              </div>
            )}
            <div className="ml-auto">
              <button
                onClick={() => { onSearchChange?.(''); setExpanded(false) }}
                className="text-sm font-semibold px-2.5 py-1.5 rounded-xl transition-colors flex-shrink-0"
                style={{ color: 'var(--t-accent-500)' }}
              >
                取消
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 px-4 overflow-y-auto flex flex-col justify-end"
            style={{ minHeight: `${layoutHintsMinHeight}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-1.5 py-1">
              {(searchHints.length > 0
                ? searchHints.filter(k => !kw || k.toLowerCase().includes(kw))
                : [
                  'Jenkins 流水线', 'Grafana 监控', 'Kubernetes 集群', 'ClickHouse 分析', 'GitLab 仓库',
                ].filter(k => !kw || k.toLowerCase().includes(kw))
              ).map((hint) => (
                <li key={hint}>
                  <button
                    onClick={() => { onSearchChange?.(hint); setExpanded(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors active:bg-[var(--t-elev)]"
                    style={{ backgroundColor: 'var(--t-card)' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-mute)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm truncate flex-1" style={{ color: 'var(--t-text-main)' }}>{hint}</span>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-mute)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {filteredSpotlight.length > 0 && (
              <div className="mt-1 mb-2">
                {!kw && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-1 h-3.5 rounded-full" aria-hidden
                      style={{ background: 'linear-gradient(180deg, var(--t-accent-400), var(--t-accent-600))' }} />
                    <h4 className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--t-text-main)' }}>
                      Sger 建议
                    </h4>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                  {filteredSpotlight.slice(0, kw ? undefined : 8).map((card) => {
                    const { t: iconChar, bg: iconBg } = iconText(card.title, card.category)
                    const label = simplifyTitle(card.title)
                    return (
                      <a
                        key={card.id}
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 group"
                        onClick={(e) => {
                          if (onOpenApp) {
                            e.preventDefault()
                            onOpenApp(card)
                            setExpanded(false)
                          }
                        }}
                      >
                        <div className="relative w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white font-black transition-transform group-active:scale-95"
                          style={{
                            background: iconBg,
                            fontSize: iconChar.length >= 3 ? '13px' : '18px',
                            boxShadow: '0 6px 16px -10px color-mix(in srgb, #000 60%, transparent)',
                          }}>
                          <div className="absolute inset-0 opacity-25 pointer-events-none rounded-2xl" style={{
                            background: 'radial-gradient(ellipse at 30% 18%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)',
                          }} />
                          <span className="relative z-10 leading-none select-none"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>{iconChar}</span>
                        </div>
                        <span className="text-[11px] font-medium leading-tight text-center line-clamp-1 truncate w-full"
                          style={{ color: 'var(--t-text-main)', minHeight: '14px' }}
                          title={card.title}>{label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 px-4 pt-2 pb-3"
            style={{
              paddingBottom: `calc(12px + ${safeBottom})`,
              borderTop: '1px solid var(--t-border-sub)',
              backgroundColor: 'var(--t-bg)',
              backdropFilter: 'saturate(140%) blur(8px)',
              WebkitBackdropFilter: 'saturate(140%) blur(8px)',
              minHeight: `${searchBarEstimate}px`,
            }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--t-text-mute)' }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-0 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--t-card)',
                    color: 'var(--t-text-main)',
                    // @ts-ignore
                    '--tw-ring-color': 'var(--t-accent-500)',
                  } as React.CSSProperties}
                  aria-label="搜索"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {search && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSearchChange?.('')
                      setTimeout(() => inputRef.current?.focus(), 0)
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                    style={{ color: 'var(--t-text-mute)' }}
                    aria-label="清空"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                style={{ color: 'var(--t-accent-500)' }}
                aria-label="收起搜索">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {!expanded && (
        <nav
          aria-label="底部导航"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        >
          {/* 小搜索框（点击放大）—— 仅在非「我的」视图 & 未进入管理功能子页时显示；宽度屏幕 1/2 居中 */}
          {view !== 'mine' && !hideGlobalSearch && (
            <div className="w-full flex justify-center pb-2">
              <button
                onClick={() => {
                  setExpanded(true)
                  inputRef.current?.focus()
                  setTimeout(() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                    }
                  }, 30)
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-lg transition-all active:scale-[0.99]"
                style={{
                  width: '50vw',
                  maxWidth: '50vw',
                  backgroundColor: 'var(--t-header)',
                  borderColor: 'var(--t-border-sub)',
                  boxShadow: '0 8px 32px -16px color-mix(in srgb, #000 60%, transparent)',
                  backdropFilter: 'saturate(150%) blur(12px)',
                  WebkitBackdropFilter: 'saturate(150%) blur(12px)',
                }}
                aria-label="打开搜索"
              >
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--t-text-sub)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium truncate" style={{ color: 'var(--t-text-mute)' }}>
                  {search?.trim() || '搜索'}
                </span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--t-accent-400)' }} />
              </button>
            </div>
          )}

          {/* 底部 4 Tab 菜单栏 */}
          <div
            className="border-t"
            style={{
              backgroundColor: 'var(--t-header)',
              borderColor: 'var(--t-border-sub)',
              boxShadow: '0 -4px 24px -16px color-mix(in srgb, #000 50%, transparent)',
              backdropFilter: 'saturate(150%) blur(12px)',
              WebkitBackdropFilter: 'saturate(150%) blur(12px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <ul className="flex items-stretch justify-around py-1.5 px-2">
              {TABS.map((tab) => {
                const active = activeId === tab.id
                const isTBD = tab.id === 'board'
                return (
                  <li key={tab.id} className="flex-1 flex justify-center">
                    <button
                      onClick={() => handleClick(tab.id)}
                      className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all w-full"
                      style={{
                        color: active ? 'var(--t-accent-500)' : 'var(--t-text-sub)',
                        backgroundColor: active
                          ? 'color-mix(in srgb, var(--t-accent-500) 8%, transparent)'
                          : 'transparent',
                        opacity: isTBD ? 0.75 : 1,
                      }}
                      aria-current={active ? 'page' : undefined}
                      disabled={expanded}
                    >
                      <div className="relative">
                        <div
                          className="transition-transform"
                          style={{ transform: active ? 'translateY(-1px) scale(1.05)' : 'none' }}
                        >
                          {tab.icon(active)}
                        </div>
                        {isTBD && (
                          <span
                            className="absolute -top-1 -right-3 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap"
                            style={{
                              background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                              color: '#fff',
                            }}
                          >
                            开发中
                          </span>
                        )}
                      </div>
                      <span
                        className="text-[11px] font-semibold leading-none mt-0.5 transition-all"
                        style={{
                          letterSpacing: active ? '0.02em' : '0',
                          color: active ? 'var(--t-accent-600)' : 'var(--t-text-mute)',
                        }}
                      >
                        {tab.label}
                      </span>
                      {isTBD && (
                        <span
                          className="text-[9px] leading-none mt-0.5 font-semibold"
                          style={{ color: 'var(--t-text-mute)' }}
                        >
                          TBD
                        </span>
                      )}
                      {active && (
                        <span
                          className="mt-1 w-5 h-1 rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, var(--t-accent-400), var(--t-accent-600))',
                          }}
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}
