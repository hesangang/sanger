import type { OrgNode, MenuItem } from './types'

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

export function genId(prefix: string) {
  return prefix + Math.floor(Math.random() * 9000 + 1000)
}
