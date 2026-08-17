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

export function getOrgById(orgs: OrgNode[], id: string): OrgNode | null {
  for (const o of orgs) {
    if (o.id === id) return o
    if (o.children) { const f = getOrgById(o.children, id); if (f) return f }
  }
  return null
}

export function getAllOrgsFlat(orgs: OrgNode[]): OrgNode[] {
  const r: OrgNode[] = []
  function walk(list: OrgNode[]) { for (const o of list) { r.push(o); if (o.children) walk(o.children) } }
  walk(orgs)
  return r
}

export function genId(prefix: string) {
  return prefix + Math.floor(Math.random() * 9000 + 1000)
}

export const TYPE_COLORS: Record<string, string> = {
  '集团': '#4f6ef7', '公司': '#8b5cf6', '部门': '#10b981', '小组': '#f59e0b', '虚拟组': '#ec4899',
}

export const INITIAL_ORG: OrgNode[] = [
  { id: 'o1', code: 'G001', name: '集团总部', type: '集团', lead: '张伟', parent: null, children: [
    { id: 'o2', code: 'C001', name: '技术有限公司', type: '公司', lead: '李娜', parent: 'o1', children: [
      { id: 'o3', code: 'D001', name: '研发部', type: '部门', lead: '王强', parent: 'o2', children: [
        { id: 'o4', code: 'G001', name: '前端组', type: '小组', lead: '刘洋', parent: 'o3', children: [] },
        { id: 'o5', code: 'G002', name: '后端组', type: '小组', lead: '陈明', parent: 'o3', children: [] },
      ]},
      { id: 'o6', code: 'D002', name: '产品部', type: '部门', lead: '赵敏', parent: 'o2', children: [
        { id: 'o7', code: 'G003', name: '产品设计组', type: '小组', lead: '孙莉', parent: 'o6', children: [] },
      ]},
      { id: 'o8', code: 'D003', name: '测试部', type: '部门', lead: '周杰', parent: 'o2', children: [] },
    ]},
    { id: 'o9', code: 'C002', name: '销售有限公司', type: '公司', lead: '吴芳', parent: 'o1', children: [
      { id: 'o10', code: 'D004', name: '华东大区', type: '部门', lead: '郑浩', parent: 'o9', children: [] },
      { id: 'o11', code: 'D005', name: '华南大区', type: '部门', lead: '冯雪', parent: 'o9', children: [] },
    ]},
  ]}
]
