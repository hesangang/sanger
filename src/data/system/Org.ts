import type { OrgNode } from './types'
export type { OrgNode }

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
