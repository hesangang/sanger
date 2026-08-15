import { useState, useEffect, useRef } from 'react'
import type { PortalCard } from '../data/portal'

interface PortalCardItemProps {
  card: PortalCard
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onVisit?: (id: number) => void
}

const categoryLabel = (c: string) =>
  c === 'dev' ? '研发效能' :
  c === 'ops' ? '运维监控' :
  c === 'data' ? '数据分析' :
  c === 'ai'  ? 'AI 能力' :
  c === 'cloud'  ? '云服务'   : '其他'

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
  // 卡片 icon 主颜色：混合 category + id 哈希，做出每个卡不同色的效果（参考 UniLink 微信绿/微博红/抖音黑/QQ蓝各不同）
  const palette = [
    'linear-gradient(135deg,#22C55E,#15803D)', // 绿
    'linear-gradient(135deg,#EF4444,#B91C1C)', // 红
    'linear-gradient(135deg,#111827,#0B0F17)', // 黑
    'linear-gradient(135deg,#3B82F6,#1D4ED8)', // 蓝
    'linear-gradient(135deg,#F59E0B,#B45309)', // 橙
    'linear-gradient(135deg,#8B5CF6,#6D28D9)', // 紫
    'linear-gradient(135deg,#EC4899,#BE185D)', // 粉
    'linear-gradient(135deg,#14B8A6,#0F766E)', // 青
  ]
  return palette[_id % palette.length]
}

const iconText = (title: string, _category: string) => {
  if (title.includes('微信'))   return { t: '微', bg: 'linear-gradient(135deg,#34D399,#047857)' }
  if (title.includes('微博'))   return { t: '微', bg: 'linear-gradient(135deg,#F87171,#DC2626)' }
  if (title.includes('抖音'))   return { t: '抖', bg: 'linear-gradient(135deg,#111827,#000000)' }
  if (title.startsWith('QQ'))   return { t: 'Q',  bg: 'linear-gradient(135deg,#38BDF8,#0284C7)' }
  if (title.includes('钉钉'))   return { t: '钉', bg: 'linear-gradient(135deg,#38BDF8,#0369A1)' }
  if (title.includes('阿里'))   return { t: '阿', bg: 'linear-gradient(135deg,#FB923C,#C2410C)' }
  if (title.includes('腾讯'))   return { t: '腾', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('华为'))   return { t: '华', bg: 'linear-gradient(135deg,#EF4444,#991B1B)' }
  if (title.includes('GitLab')) return { t: 'GL', bg: categoryColor('dev').bg }
  if (title.includes('Bruno')) return { t: 'Br', bg: 'linear-gradient(135deg,#1E1B4B,#0F172A)' }
  if (title.includes('Sentry'))   return { t: 'Se', bg: 'linear-gradient(135deg,#9C27B0,#360D3B)' }
  if (title.includes('Grafana')&&title.includes('k6')) return { t: 'k6', bg: 'linear-gradient(135deg,#7B217F,#3C0D3D)' }
  if (title.includes('Mattermost')||title.includes('团队沟通')) return { t: 'Mm', bg: 'linear-gradient(135deg,#0058CC,#002D6E)' }
  if (title.includes('Jenkins'))return { t: 'Jk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Grafana')&&title.includes('Beyla')) return { t: 'Gb', bg: 'linear-gradient(135deg,#10B981,#064E3B)' }
  if (title.includes('Grafana')&&title.includes('Tempo')) return { t: 'Gt', bg: 'linear-gradient(135deg,#F97316,#7C2D12)' }
  if (title.includes('Grafana')&&title.includes('Mimir')) return { t: 'Gm', bg: 'linear-gradient(135deg,#16A34A,#064E3B)' }
  if (title.includes('Grafana'))return { t: 'Gf', bg: categoryColor('ops').bg }
  if (title.includes('Kuber'))  return { t: 'K8', bg: 'linear-gradient(135deg,#60A5FA,#2563EB)' }
  if (title.includes('ELK') || title.includes('Kibana')) return { t: 'Kb', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Metabase'))return { t: 'Mb', bg: categoryColor('data').bg }
  if (title.includes('Superset'))return { t: 'Ss', bg: 'linear-gradient(135deg,#14B8A6,#0F766E)' }
  if (title.includes('大模型') || title.includes('LLM') || title.includes('推理')) return { t: 'AI', bg: categoryColor('ai').bg }
  if (title.includes('绘画'))   return { t: 'Art', bg: 'linear-gradient(135deg,#F472B6,#DB2777)' }
  if (title.includes('向量'))   return { t: 'Vec', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }
  if (title.includes('飞书'))   return { t: '飞', bg: 'linear-gradient(135deg,#334155,#1E293B)' }
  if (title.includes('企业'))   return { t: '企', bg: 'linear-gradient(135deg,#34D399,#047857)' }
  if (title.includes('WPS'))    return { t: 'W',  bg: 'linear-gradient(135deg,#EF4444,#B91C1C)' }
  if (title.includes('会议'))   return { t: '会', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('MinIO'))  return { t: 'M',  bg: 'linear-gradient(135deg,#EF4444,#B91C1C)' }
  if (title.includes('Harbor')) return { t: 'H',  bg: categoryColor('cloud').bg }
  if (title.includes('DNS') || title.includes('域名')) return { t: 'NS', bg: 'linear-gradient(135deg,#10B981,#047857)' }
  if (title.includes('Apache Doris')||title.includes('Doris')) return { t: 'Dr', bg: 'linear-gradient(135deg,#1E40AF,#002075)' }
  if (title.includes('Flink'))  return { t: 'Fk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Dify'))   return { t: 'Df', bg: categoryColor('ai').bg }
  if (title.includes('OCR'))    return { t: 'OR', bg: 'linear-gradient(135deg,#22D3EE,#0891B2)' }
  if (title.includes('ASR'))    return { t: 'SR', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }
  if (title.includes('Sonar'))  return { t: 'Sq', bg: 'linear-gradient(135deg,#34D399,#047857)' }
  if (title.includes('Nexus'))  return { t: 'Nx', bg: 'linear-gradient(135deg,#60A5FA,#1D4ED8)' }
  if (title.includes('Rancher'))return { t: 'Rn', bg: categoryColor('cloud').bg }
  if (title.includes('Dolphin'))return { t: 'Ds', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Hue'))    return { t: 'Hu', bg: categoryColor('data').bg }
  if (title.includes('ClickHouse')||title.includes('Click')) return { t: 'CH', bg: 'linear-gradient(135deg,#FFCC00,#B45309)' }
  if (title.includes('Kylin'))  return { t: 'Ky', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('dbt'))    return { t: 'dt', bg: 'linear-gradient(135deg,#FF6B6B,#B91C1C)' }
  if (title.includes('Airbyte'))return { t: 'Ab', bg: 'linear-gradient(135deg,#615EFC,#4338CA)' }
  if (title.includes('SeaTunnel')||title.includes('Tunnel')) return { t: 'ST', bg: categoryColor('data').bg }
  if (title.includes('DataX'))  return { t: 'DX', bg: 'linear-gradient(135deg,#FF6A00,#B45309)' }
  if (title.includes('OpenTelemetry')||title.includes('OTel')||title.includes('埋点')) return { t: 'OT', bg: 'linear-gradient(135deg,#000000,#1F2937)' }
  if (title.includes('Jaeger')) return { t: 'Jg', bg: 'linear-gradient(135deg,#6366F1,#312E81)' }
  if (title.includes('Tempo'))  return { t: 'Gt', bg: 'linear-gradient(135deg,#F97316,#7C2D12)' }
  if (title.includes('Mimir'))  return { t: 'Gm', bg: 'linear-gradient(135deg,#16A34A,#064E3B)' }
  if (title.includes('Vector')&&title.includes('采集')) return { t: 'Vc', bg: 'linear-gradient(135deg,#F59E0B,#78350F)' }
  if (title.includes('Beyla'))  return { t: 'Gb', bg: 'linear-gradient(135deg,#10B981,#064E3B)' }
  if (title.includes('Loki'))   return { t: 'Lk', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' }
  if (title.includes('Argo'))   return { t: 'Ar', bg: 'linear-gradient(135deg,#6366F1,#4338CA)' }
  if (title.includes('Nacos'))  return { t: 'Na', bg: 'linear-gradient(135deg,#10B981,#065F46)' }
  if (title.includes('Vault'))  return { t: 'Va', bg: 'linear-gradient(135deg,#111827,#000000)' }
  if (title.includes('Notion')) return { t: 'Nt', bg: 'linear-gradient(135deg,#111827,#0B0F17)' }
  if (title.includes('Midjour'))return { t: 'Mj', bg: categoryColor('ai').bg }
  if (title.includes('Ollama')) return { t: 'Ol', bg: 'linear-gradient(135deg,#000000,#1F2937)' }
  if (title.includes('ComfyUI')) return { t: 'Cf', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' }
  if (title.includes('LangChain')||title.includes('Lang')) return { t: 'Lc', bg: 'linear-gradient(135deg,#1C3F39,#000000)' }
  if (title.includes('Suno'))    return { t: 'Sn', bg: 'linear-gradient(135deg,#000000,#7C2D12)' }
  if (title.includes('Cursor'))  return { t: 'Cr', bg: 'linear-gradient(135deg,#1E293B,#000000)' }
  if (title.includes('Stable Diffusion')||title.includes('WebUI')) return { t: 'SD', bg: 'linear-gradient(135deg,#A855F7,#4C1D95)' }
  if (title.includes('DingTalk')|| title.includes('OA')) return { t: 'OA', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  // fallback
  return { t: title.slice(0, 2).toUpperCase().replace(/[^A-Z0-9\u4e00-\u9fa5]/g, '').slice(0, 2) || '◆', bg: cardIdGradient(Number(title.length + title.charCodeAt(0))) }
}

export default function PortalCardItem({ card, isFavorite, onToggleFavorite, onVisit }: PortalCardItemProps) {
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

  // 移动端 APP 图标样式下 title 简化规则：有英文则优先英文，去掉中文说明/翻译
  const simplifyTitle = (t: string): string => {
    // 显式映射：含专有英文缩写的直接返回英文本体
    const exactMap: [RegExp, string][] = [
      [/^GitLab\b/i, 'GitLab'],
      [/^Bruno\b/i, 'Bruno'],
      [/^Jenkins\b/i, 'Jenkins'],
      [/SonarQube/i, 'SonarQube'],
      [/k6/i, 'k6'],
      [/Nexus/i, 'Nexus'],
      [/Sentry/i, 'Sentry'],
      [/Mattermost/i, 'Mattermost'],
      [/Grafana\s*Beyla/i, 'Beyla'],
      [/Grafana\s*Tempo/i, 'Tempo'],
      [/Grafana\s*Mimir/i, 'Mimir'],
      [/^Grafana\b/i, 'Grafana'],
      [/Kubernetes/i, 'Kubernetes'],
      [/OpenTelemetry/i, 'OpenTel'],
      [/Jaeger/i, 'Jaeger'],
      [/Tempo/i, 'Tempo'],
      [/Mimir/i, 'Mimir'],
      [/^Loki\b/i, 'Loki'],
      [/^Vector\b/i, 'Vector'],
      [/Argo\s*CD/i, 'Argo CD'],
      [/Nacos/i, 'Nacos'],
      [/Vault/i, 'Vault'],
      [/Metabase/i, 'Metabase'],
      [/Superset/i, 'Superset'],
      [/DolphinScheduler/i, 'Dolphin'],
      [/ClickHouse/i, 'ClickHouse'],
      [/Doris/i, 'Doris'],
      [/^Flink\b/i, 'Flink'],
      [/Kylin/i, 'Kylin'],
      [/^dbt\b/i, 'dbt'],
      [/Airbyte/i, 'Airbyte'],
      [/SeaTunnel/i, 'SeaTunnel'],
      [/DataX/i, 'DataX'],
      [/^Hue\b/i, 'Hue'],
      [/Midjourney/i, 'Midjourney'],
      [/Milvus/i, 'Milvus'],
      [/Ollama/i, 'Ollama'],
      [/ComfyUI/i, 'ComfyUI'],
      [/LangChain/i, 'LangChain'],
      [/^Suno\b/i, 'Suno'],
      [/^Cursor\b/i, 'Cursor'],
      [/Stable\s*Diffusion/i, 'SD WebUI'],
      [/Tesseract/i, 'Tesseract'],
      [/Whisper/i, 'Whisper'],
      [/^Dify\b/i, 'Dify'],
      [/MinIO/i, 'MinIO'],
      [/Harbor/i, 'Harbor'],
      [/^DNS\b/i, 'DNS'],
      [/大模型推理网关/i, 'LLM 网关'],
      [/阿里云控制台/i, '阿里云'],
      [/腾讯云控制台/i, '腾讯云'],
      [/华为云控制台/i, '华为云'],
    ]
    for (const [re, val] of exactMap) if (re.test(t)) return val
    // 正则兜底：提取开头的连续 ASCII 英文/数字串作为简化名
    const m = t.match(/^[A-Za-z][A-Za-z0-9.\-+_ ]{0,12}[A-Za-z0-9]?/)
    return m ? m[0].trim() : t
  }

  const shortTitle = simplifyTitle(card.title)
  // 移动端：仅 Logo 方块 + 名称在下方（仿手机主屏幕应用图标）
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
      {/* 移动端 APP 图标样式：仅 sm 以下显示，sm+ 显示桌面完整卡片 */}
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

      {/* 桌面端（sm+）：完整卡片 */}
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
        {/* 第一行：icon 方块 + 标题分类 + 收藏按钮 */}
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

        {/* 第二行：描述 */}
        <p
          className="mt-3 text-[13px] leading-relaxed line-clamp-2"
          style={{ color: 'var(--t-text-sub)' }}
          title={card.description}
        >
          {card.description}
        </p>

        {/* 第三行：分隔线 + 收藏状态 + 箭头 */}
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

        {/* 分类角标（右上角，hover出现） */}
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
