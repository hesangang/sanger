import type { UserItem } from './OrgManage'
export type { UserItem }

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

export const AVATAR_COLORS = [
  '#4f6ef7','#10b981','#f59e0b','#8b5cf6','#ef4444',
  '#06b6d4','#ec4899','#6366f1','#14b8a6','#f97316',
]
