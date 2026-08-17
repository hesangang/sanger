import type { Position } from './types'
export type { Position }

export const INITIAL_POSITIONS: Position[] = [
  { id: 'p1', code: 'J001', name: '技术总监', level: 'M3', org: 'o2', desc: '负责技术团队整体规划与技术决策', status: '启用' },
  { id: 'p2', code: 'J002', name: '前端架构师', level: 'M2', org: 'o3', desc: '负责前端技术选型与架构设计', status: '启用' },
  { id: 'p3', code: 'J003', name: '高级工程师', level: 'P5', org: 'o3', desc: '负责核心业务系统开发与维护', status: '启用' },
  { id: 'p4', code: 'J004', name: '产品经理', level: 'M1', org: 'o6', desc: '负责产品规划与需求管理', status: '启用' },
  { id: 'p5', code: 'J005', name: '测试工程师', level: 'P3', org: 'o8', desc: '负责系统测试与质量保障', status: '启用' },
  { id: 'p6', code: 'J006', name: '销售经理', level: 'M1', org: 'o9', desc: '负责区域销售团队管理', status: '启用' },
  { id: 'p7', code: 'J007', name: '客户经理', level: 'P4', org: 'o10', desc: '负责大客户开发与维护', status: '停用' },
]

export const LEVEL_COLORS: Record<string, string> = {
  M1: '#4f6ef7', M2: '#8b5cf6', M3: '#ec4899',
  P1: '#10b981', P2: '#06b6d4', P3: '#f59e0b', P4: '#ef4444', P5: '#6366f1',
}
