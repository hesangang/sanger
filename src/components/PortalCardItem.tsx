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
  c === 'office' ? '办公协作' :
  c === 'cloud'  ? '云服务'   : '其他'

const categoryColor = (c: string): { bg: string; fg: string } => {
  switch (c) {
    case 'dev':    return { bg: 'linear-gradient(135deg,#38BDF8,#0284C7)', fg: '#0C4A6E' }
    case 'ops':    return { bg: 'linear-gradient(135deg,#34D399,#047857)', fg: '#064E3B' }
    case 'data':   return { bg: 'linear-gradient(135deg,#22D3EE,#0891B2)', fg: '#164E63' }
    case 'ai':     return { bg: 'linear-gradient(135deg,#F472B6,#BE185D)', fg: '#831843' }
    case 'office': return { bg: 'linear-gradient(135deg,#FB923C,#C2410C)', fg: '#7C2D12' }
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
  if (title.includes('微信'))   return { t: '微', bg: categoryColor('office').bg }
  if (title.includes('微博'))   return { t: '微', bg: 'linear-gradient(135deg,#F87171,#DC2626)' }
  if (title.includes('抖音'))   return { t: '抖', bg: 'linear-gradient(135deg,#111827,#000000)' }
  if (title.startsWith('QQ'))   return { t: 'Q',  bg: 'linear-gradient(135deg,#38BDF8,#0284C7)' }
  if (title.includes('钉钉'))   return { t: '钉', bg: 'linear-gradient(135deg,#38BDF8,#0369A1)' }
  if (title.includes('阿里'))   return { t: '阿', bg: 'linear-gradient(135deg,#FB923C,#C2410C)' }
  if (title.includes('腾讯'))   return { t: '腾', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }
  if (title.includes('华为'))   return { t: '华', bg: 'linear-gradient(135deg,#EF4444,#991B1B)' }
  if (title.includes('GitLab')) return { t: 'GL', bg: categoryColor('dev').bg }
  if (title.includes('Jenkins'))return { t: 'Jk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Jira'))   return { t: 'Jr', bg: 'linear-gradient(135deg,#3B82F6,#1E40AF)' }
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
  if (title.includes('Tableau'))return { t: 'Tb', bg: 'linear-gradient(135deg,#2563EB,#1E3A8A)' }
  if (title.includes('Flink'))  return { t: 'Fk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Dify'))   return { t: 'Df', bg: categoryColor('ai').bg }
  if (title.includes('OCR'))    return { t: 'OR', bg: 'linear-gradient(135deg,#22D3EE,#0891B2)' }
  if (title.includes('ASR'))    return { t: 'SR', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }
  if (title.includes('Confluence')) return { t: 'Co', bg: 'linear-gradient(135deg,#22C55E,#15803D)' }
  if (title.includes('Sonar'))  return { t: 'Sq', bg: 'linear-gradient(135deg,#34D399,#047857)' }
  if (title.includes('Nexus'))  return { t: 'Nx', bg: 'linear-gradient(135deg,#60A5FA,#1D4ED8)' }
  if (title.includes('Promet')) return { t: 'Pm', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Alert'))  return { t: 'Am', bg: 'linear-gradient(135deg,#EF4444,#991B1B)' }
  if (title.includes('Rancher'))return { t: 'Rn', bg: categoryColor('cloud').bg }
  if (title.includes('Dolphin'))return { t: 'Ds', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' }
  if (title.includes('Hue'))    return { t: 'Hu', bg: categoryColor('data').bg }
  if (title.includes('Notion')) return { t: 'Nt', bg: 'linear-gradient(135deg,#111827,#0B0F17)' }
  if (title.includes('Midjour'))return { t: 'Mj', bg: categoryColor('ai').bg }
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

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:-translate-y-0.5"
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
      onClick={() => onVisit?.(card.id)}
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
            <h3 className="font-semibold text-base sm:text-[17px] truncate min-w-0" style={{ color: 'var(--t-text-main)' }}>
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
            title={isFavorite ? '取消收藏' : '收藏该应用'}
            aria-pressed={!!isFavorite}
            aria-label={isFavorite ? '取消收藏' : '收藏该应用'}
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

      {/* 分类角标（右上角，hover出现，UniLink图没有，用做点缀） */}
      <div
        className="absolute top-3 right-3 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"
        style={{
          backgroundColor: catStyle.bg,
          color: '#fff',
        }}
      >
        {catName}
      </div>
    </a>
  )
}
