import type { RoleItem, ToastFn, MenuItem } from './types'
export type { RoleItem, ToastFn, MenuItem }

export const INITIAL_ROLES: RoleItem[] = [
  { id: 'r1', code: 'R001', name: '超级管理员', desc: '拥有系统全部权限', dataScope: '全部', status: '启用', menuIds: [], userCount: 1, createdAt: '2026-01-01' },
  { id: 'r2', code: 'R002', name: '系统管理员', desc: '负责系统配置与维护', dataScope: '自定义', status: '启用', menuIds: ['m2','m3','m4','m5','m6','m7'], userCount: 3, createdAt: '2026-01-15' },
  { id: 'r3', code: 'R003', name: '部门经理', desc: '负责本部门人员管理', dataScope: '本部门', status: '启用', menuIds: ['m1','m3','m5'], userCount: 12, createdAt: '2026-02-01' },
  { id: 'r4', code: 'R004', name: '普通用户', desc: '基础功能访问权限', dataScope: '本人', status: '启用', menuIds: ['m1'], userCount: 86, createdAt: '2026-02-10' },
  { id: 'r5', code: 'R005', name: '访客角色', desc: '临时访客，仅查看', dataScope: '本人', status: '停用', menuIds: ['m1'], userCount: 5, createdAt: '2026-03-01' },
  { id: 'r6', code: 'R006', name: '审计员', desc: '查看日志与审计', dataScope: '全部', status: '启用', menuIds: ['m1','m11','m12','m13'], userCount: 2, createdAt: '2026-04-20' },
]

export const DATA_SCOPE_COLORS: Record<string, string> = {
  '全部': '#ef4444', '自定义': '#8b5cf6', '本部门': '#f59e0b', '本部门及下级': '#06b6d4', '本人': '#10b981',
}
