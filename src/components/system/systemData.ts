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

export const INITIAL_POSITIONS: Position[] = [
  { id: 'p1', code: 'J001', name: '技术总监', level: 'M3', org: 'o2', desc: '负责技术团队整体规划与技术决策', status: '启用' },
  { id: 'p2', code: 'J002', name: '前端架构师', level: 'M2', org: 'o3', desc: '负责前端技术选型与架构设计', status: '启用' },
  { id: 'p3', code: 'J003', name: '高级工程师', level: 'P5', org: 'o3', desc: '负责核心业务系统开发与维护', status: '启用' },
  { id: 'p4', code: 'J004', name: '产品经理', level: 'M1', org: 'o6', desc: '负责产品规划与需求管理', status: '启用' },
  { id: 'p5', code: 'J005', name: '测试工程师', level: 'P3', org: 'o8', desc: '负责系统测试与质量保障', status: '启用' },
  { id: 'p6', code: 'J006', name: '销售经理', level: 'M1', org: 'o9', desc: '负责区域销售团队管理', status: '启用' },
  { id: 'p7', code: 'J007', name: '客户经理', level: 'P4', org: 'o10', desc: '负责大客户开发与维护', status: '停用' },
]

export const INITIAL_USERS: UserItem[] = [
  { id: 'u1', name: '张三', code: 'A1001', phone: '13800138001', email: 'zhangsan@company.com', org: 'o3', pos: 'p2', status: '正常', avatarColor: '#4f6ef7' },
  { id: 'u2', name: '李四', code: 'A1002', phone: '13800138002', email: 'lisi@company.com', org: 'o3', pos: 'p3', status: '正常', avatarColor: '#10b981' },
  { id: 'u3', name: '王五', code: 'A1003', phone: '13800138003', email: 'wangwu@company.com', org: 'o2', pos: 'p1', status: '正常', avatarColor: '#f59e0b' },
  { id: 'u4', name: '赵六', code: 'A1004', phone: '13800138004', email: 'zhaoliu@company.com', org: 'o6', pos: 'p4', status: '正常', avatarColor: '#8b5cf6' },
  { id: 'u5', name: '钱七', code: 'A1005', phone: '13800138005', email: 'qianqi@company.com', org: 'o8', pos: 'p5', status: '正常', avatarColor: '#ef4444' },
  { id: 'u6', name: '孙八', code: 'A1006', phone: '13800138006', email: 'sunba@company.com', org: 'o9', pos: 'p6', status: '正常', avatarColor: '#06b6d4' },
  { id: 'u7', name: '周九', code: 'A1007', phone: '13800138007', email: 'zhoujiu@company.com', org: 'o10', pos: 'p7', status: '冻结', avatarColor: '#ec4899' },
  { id: 'u8', name: '吴十', code: 'A1008', phone: '13800138008', email: 'wushi@company.com', org: 'o4', pos: 'p3', status: '正常', avatarColor: '#6366f1' },
  { id: 'u9', name: '郑十一', code: 'A1009', phone: '13800138009', email: 'zheng11@company.com', org: 'o5', pos: 'p2', status: '正常', avatarColor: '#14b8a6' },
  { id: 'u10', name: '冯十二', code: 'A1010', phone: '13800138010', email: 'feng12@company.com', org: 'o11', pos: 'p6', status: '正常', avatarColor: '#f97316' },
]

export const INITIAL_MENUS: MenuItem[] = [
  { id: 'm1', code: 'M001', name: '首页', type: '菜单', parent: null, path: '/console', icon: '📊', sort: 1, status: '启用', perm: 'console:view', children: [] },
  { id: 'm2', code: 'M002', name: '管理中心', type: '目录', parent: null, path: '/system', icon: '⚙️', sort: 2, status: '启用', perm: 'system', children: [
    { id: 'm3', code: 'M003', name: '组织管理', type: '菜单', parent: 'm2', path: '/system/org', icon: '🏗️', sort: 1, status: '启用', perm: 'system:org', children: [
      { id: 'm3a', code: 'M003A', name: '组织新增', type: '按钮', parent: 'm3', path: '', icon: '', sort: 1, status: '启用', perm: 'system:org:add', children: [] },
      { id: 'm3b', code: 'M003B', name: '组织编辑', type: '按钮', parent: 'm3', path: '', icon: '', sort: 2, status: '启用', perm: 'system:org:edit', children: [] },
      { id: 'm3c', code: 'M003C', name: '组织删除', type: '按钮', parent: 'm3', path: '', icon: '', sort: 3, status: '启用', perm: 'system:org:del', children: [] },
    ]},
    { id: 'm4', code: 'M004', name: '岗位管理', type: '菜单', parent: 'm2', path: '/system/position', icon: '💼', sort: 2, status: '启用', perm: 'system:position', children: [] },
    { id: 'm5', code: 'M005', name: '用户管理', type: '菜单', parent: 'm2', path: '/system/user', icon: '👤', sort: 3, status: '启用', perm: 'system:user', children: [] },
    { id: 'm6', code: 'M006', name: '菜单管理', type: '菜单', parent: 'm2', path: '/system/menu', icon: '📋', sort: 4, status: '启用', perm: 'system:menu', children: [] },
    { id: 'm7', code: 'M007', name: '角色管理', type: '菜单', parent: 'm2', path: '/system/role', icon: '🛡️', sort: 5, status: '启用', perm: 'system:role', children: [] },
  ]},
  { id: 'm8', code: 'M008', name: '应用中心', type: '目录', parent: null, path: '/apps', icon: '📦', sort: 3, status: '启用', perm: 'apps', children: [
    { id: 'm9', code: 'M009', name: '应用列表', type: '菜单', parent: 'm8', path: '/apps/list', icon: '🔗', sort: 1, status: '启用', perm: 'apps:list', children: [] },
    { id: 'm10', code: 'M010', name: '分类管理', type: '菜单', parent: 'm8', path: '/apps/category', icon: '🏷️', sort: 2, status: '启用', perm: 'apps:cat', children: [] },
  ]},
  { id: 'm11', code: 'M011', name: '日志审计', type: '目录', parent: null, path: '/log', icon: '📝', sort: 4, status: '停用', perm: 'log', children: [
    { id: 'm12', code: 'M012', name: '登录日志', type: '菜单', parent: 'm11', path: '/log/login', icon: '🔐', sort: 1, status: '启用', perm: 'log:login', children: [] },
    { id: 'm13', code: 'M013', name: '操作日志', type: '菜单', parent: 'm11', path: '/log/op', icon: '🔧', sort: 2, status: '启用', perm: 'log:op', children: [] },
  ]},
]

export const INITIAL_ROLES: RoleItem[] = [
  { id: 'r1', code: 'R001', name: '超级管理员', desc: '拥有系统全部权限', dataScope: '全部', status: '启用', menuIds: [], userCount: 1, createdAt: '2026-01-01' },
  { id: 'r2', code: 'R002', name: '系统管理员', desc: '负责系统配置与维护', dataScope: '自定义', status: '启用', menuIds: ['m2','m3','m4','m5','m6','m7'], userCount: 3, createdAt: '2026-01-15' },
  { id: 'r3', code: 'R003', name: '部门经理', desc: '负责本部门人员管理', dataScope: '本部门', status: '启用', menuIds: ['m1','m3','m5'], userCount: 12, createdAt: '2026-02-01' },
  { id: 'r4', code: 'R004', name: '普通用户', desc: '基础功能访问权限', dataScope: '本人', status: '启用', menuIds: ['m1'], userCount: 86, createdAt: '2026-02-10' },
  { id: 'r5', code: 'R005', name: '访客角色', desc: '临时访客，仅查看', dataScope: '本人', status: '停用', menuIds: ['m1'], userCount: 5, createdAt: '2026-03-01' },
  { id: 'r6', code: 'R006', name: '审计员', desc: '查看日志与审计', dataScope: '全部', status: '启用', menuIds: ['m1','m11','m12','m13'], userCount: 2, createdAt: '2026-04-20' },
]

export const LEVEL_COLORS: Record<string, string> = { M1: '#4f6ef7', M2: '#8b5cf6', M3: '#ec4899', P1: '#10b981', P2: '#06b6d4', P3: '#f59e0b', P4: '#ef4444', P5: '#6366f1' }
export const TYPE_COLORS: Record<string, string> = { '集团': '#4f6ef7', '公司': '#8b5cf6', '部门': '#10b981', '小组': '#f59e0b', '虚拟组': '#ec4899' }
export const MENU_TYPE_COLORS: Record<string, string> = { '目录': '#8b5cf6', '菜单': '#4f6ef7', '按钮': '#6b7280' }
export const AVATAR_COLORS = ['#4f6ef7','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#ec4899','#6366f1','#14b8a6','#f97316']
export const DATA_SCOPE_COLORS: Record<string, string> = { '全部': '#ef4444', '自定义': '#8b5cf6', '本部门': '#f59e0b', '本部门及下级': '#06b6d4', '本人': '#10b981' }

export function getOrgById(orgs: OrgNode[], id: string): OrgNode | null {
  for (const o of orgs) {
    if (o.id === id) return o
    if (o.children) { const f = getOrgById(o.children, id); if (f) return f }
  }
  return null
}

export function getMenuById(menus: MenuItem[], id: string): MenuItem | null {
  for (const m of menus) {
    if (m.id === id) return m
    if (m.children) { const f = getMenuById(m.children, id); if (f) return f }
  }
  return null
}

export function getAllOrgsFlat(orgs: OrgNode[]): OrgNode[] {
  const r: OrgNode[] = []
  function walk(list: OrgNode[]) { for (const o of list) { r.push(o); if (o.children) walk(o.children) } }
  walk(orgs)
  return r
}

export function getAllMenusFlat(menus: MenuItem[]): MenuItem[] {
  const r: MenuItem[] = []
  function walk(list: MenuItem[]) { for (const m of list) { r.push(m); if (m.children) walk(m.children) } }
  walk(menus)
  return r
}

export function genId(prefix: string) { return prefix + Math.floor(Math.random() * 9000 + 1000) }

export function pushToastLocal(toasts: { id: number; message: string; type: string }[], setToasts: (t: any) => void, message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = Date.now() + Math.random()
  setToasts([...toasts, { id, message, type }])
  setTimeout(() => setToasts((p: any) => p.filter((t: any) => t.id !== id)), 3000)
}

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

export const SYSTEM_APP_CATEGORIES: SystemAppCategory[] = [
  {
    id: 'user',
    label: '组织人事',
    color: '#4f6ef7',
    apps: [
      { key: 'org',      name: '组织管理', icon: '🏢' },
      { key: 'position', name: '岗位管理', icon: '💼' },
      { key: 'user',     name: '用户管理', icon: '👥' },
      { key: 'role',     name: '角色管理', icon: '🛡️' },
    ],
  },
  {
    id: 'system',
    label: '系统配置',
    color: '#8b5cf6',
    apps: [
      { key: 'menu', name: '菜单管理', icon: '📑' },
      { key: 'app_list',     name: '应用列表', icon: '🧩', badge: '新', tbd: true },
      { key: 'app_category', name: '分类管理', icon: '🏷️', tbd: true },
    ],
  },
  {
    id: 'log',
    label: '日志审计',
    color: '#f59e0b',
    apps: [
      { key: 'login_log', name: '登录日志', icon: '📝', tbd: true },
      { key: 'op_log',    name: '操作日志', icon: '📊', tbd: true },
    ],
  },
]
