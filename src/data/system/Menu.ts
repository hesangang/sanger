import type {
  MenuItem, SystemAppKey, SystemAppItem, SystemAppCategory, ContentKey, MobileSystemTab,
} from './types'
export type { MenuItem, SystemAppKey, SystemAppItem, SystemAppCategory, ContentKey, MobileSystemTab }

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

export const MENU_TYPE_COLORS: Record<string, string> = { '目录': '#8b5cf6', '菜单': '#4f6ef7', '按钮': '#6b7280' }

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

export const MENU_ID_TO_CONTENT: Record<string, ContentKey> = {
  m3:  'org',
  m4:  'position',
  m5:  'user',
  m6:  'menu',
  m7:  'role',
}

export const CONTENT_JUMP_MAP: Record<string, [ContentKey, string]> = {
  org:       ['org',       'm3'],
  position:  ['position',  'm4'],
  user:      ['user',      'm5'],
  menu:      ['menu',      'm6'],
  role:      ['role',      'm7'],
}

export const INITIAL_DIR_EXPANDED = ['m2']
export const DEFAULT_ACTIVE_MENU = 'm3'
export const DEFAULT_CONTENT_KEY: ContentKey = 'org'

export const MOBILE_SYSTEM_TABS: MobileSystemTab[] = [
  { k: 'org',       m: 'm3', i: '🏗️', l: '组织' },
  { k: 'position',  m: 'm4', i: '💼', l: '岗位' },
  { k: 'user',      m: 'm5', i: '👤', l: '用户' },
  { k: 'menu',      m: 'm6', i: '📋', l: '菜单' },
  { k: 'role',      m: 'm7', i: '🛡️', l: '角色' },
]
