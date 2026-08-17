import type { AccentKey } from './Portal'
import { ACCENTS } from './Portal'
import type { BrandInfo, CurrentUser, MenuLink } from './Header'
import { BRAND, CURRENT_USER, LOGOUT_MENU } from './Header'

export interface MessageCenterItem {
  icon: string
  tint: 'accent' | 'ok'
  title: string
  countLabel?: string
  summary: string
}

export { BRAND, CURRENT_USER, LOGOUT_MENU, ACCENTS }
export type { BrandInfo, CurrentUser, MenuLink, AccentKey }

export const MINE_MESSAGE_CENTER: MessageCenterItem[] = [
  {
    icon: '🔔',
    tint: 'accent',
    title: '系统通知',
    countLabel: '未读 3',
    summary: '最近版本更新、运维告警等推送',
  },
  {
    icon: '🛡',
    tint: 'ok',
    title: '安全与权限',
    countLabel: '正常',
    summary: '账户安全、密码修改、访问日志',
  },
  {
    icon: '👥',
    tint: 'accent',
    title: '我的团队',
    countLabel: '12 人',
    summary: '架构组 · SRE · 大数据 · AI 研发',
  },
]

export const MINE_THEME_ABOUT = {
  tint: 'accent' as const,
  title: `关于 ${BRAND.name}`,
  summary: `服务中心 · ${BRAND.fullVersionLabel} · © ${new Date().getFullYear()}`,
  badgeLabel: '最新版本',
}
