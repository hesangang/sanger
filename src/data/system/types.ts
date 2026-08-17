export interface OrgNode {
  id: string
  code: string
  name: string
  type: string
  lead: string
  parent: string | null
  children: OrgNode[]
}

export interface Position {
  id: string
  code: string
  name: string
  level: string
  org: string
  desc: string
  status: string
}

export interface UserItem {
  id: string
  name: string
  code: string
  phone: string
  email: string
  org: string
  pos: string
  status: string
  avatarColor: string
}

export interface MenuItem {
  id: string
  code: string
  name: string
  type: '目录' | '菜单' | '按钮'
  parent: string | null
  path: string
  icon: string
  sort: number
  status: string
  perm: string
  children: MenuItem[]
}

export interface RoleItem {
  id: string
  code: string
  name: string
  desc: string
  dataScope: string
  status: string
  menuIds: string[]
  userCount: number
  createdAt: string
}

export type ToastFn = (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void

export type SystemAppKey = 'org' | 'position' | 'user' | 'menu' | 'role' | 'app_list' | 'app_category' | 'login_log' | 'op_log'

export interface SystemAppItem {
  key: SystemAppKey
  name: string
  icon: string
  badge?: string
  tbd?: boolean
}

export interface SystemAppCategory {
  id: string
  label: string
  color: string
  apps: SystemAppItem[]
}

export type ContentKey = 'org' | 'position' | 'user' | 'menu' | 'role'

export interface MobileSystemTab {
  k: ContentKey
  m: string
  i: string
  l: string
}
