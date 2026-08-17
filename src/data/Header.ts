import type { ViewMode } from '../App'

export interface BrandInfo {
  name: string
  shortName: string
  logoBadge: string
  editionLabel: string
  version: string
  fullVersionLabel: string
  description: string
}

export interface CurrentUser {
  displayName: string
  avatarChar: string
  title: string
  org: string
  badgeLabel: string
  email?: string
  unreadNotice?: number
  teamMemberCount?: number
}

export interface TopNavItem {
  id: ViewMode
  label: string
  badgeLabel?: string
}

export interface MenuLink {
  icon: string
  label: string
  badge?: string
  colorKey?: 'ok' | 'warn' | 'error' | 'accent'
  target?: string
}

export const BRAND: BrandInfo = {
  name: 'SanGer',
  shortName: 'SG',
  logoBadge: 'SG',
  editionLabel: '企业版',
  version: 'v3.0.0',
  fullVersionLabel: 'v1.0.0',
  description: '企业级应用集成平台',
}

export const CURRENT_USER: CurrentUser = {
  displayName: '三掌柜',
  avatarChar: '三',
  title: '超级管理员',
  org: '三格尔科技',
  badgeLabel: '超级管理员',
  email: 'sangzg@sanger.com',
  unreadNotice: 3,
  teamMemberCount: 12,
}

export const HEADER_TOP_NAV: TopNavItem[] = [
  { id: 'overview',  label: '首页' },
  { id: 'system',    label: '管理中心' },
  { id: 'overview',  label: '数据看板', badgeLabel: '开发中' },
]

export const HEADER_SETTING_MENU: MenuLink[] = [
  { icon: '🔔', label: '通知设置' },
  { icon: '👥', label: '成员与权限' },
  { icon: '🔐', label: '安全策略' },
  { icon: '❓', label: '帮助与反馈' },
]

export const HEADER_USER_MENU: MenuLink[] = [
  { icon: '👤', label: '查看个人资料' },
  { icon: '💼', label: '我的工作台' },
  { icon: '🔑', label: '账号与安全' },
  { icon: '⚙️', label: '偏好设置' },
]

export const LOGOUT_MENU: MenuLink = {
  icon: '🚪',
  label: '退出登录',
  colorKey: 'error',
}

export const SEARCH_DESKTOP_PLACEHOLDER = '搜索系统、名称、标签…'
