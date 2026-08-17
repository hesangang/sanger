import { useState, useMemo } from 'react'
import type { RoleItem, MenuItem, ToastFn } from '../../data/system/Role'
import { genId, getAllMenusFlat } from '../../data/system/utils'
import { DATA_SCOPE_COLORS } from '../../data/system/Role'
import { Field, Input, Modal } from './Org'

interface Props {
  roles: RoleItem[]
  setRoles: (r: RoleItem[]) => void
  menus: MenuItem[]
  toast: ToastFn
}

export default function RoleManage({ roles, setRoles, menus, toast }: Props) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPermModal, setShowPermModal] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)
  const [form, setForm] = useState({ name: '', code: '', desc: '', dataScope: '本部门' })
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['m2']))
  const [checkedMenus, setCheckedMenus] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => roles.filter(r => r.name.includes(search) || r.code.toLowerCase().includes(search.toLowerCase())), [roles, search])
  const allMenus = getAllMenusFlat(menus)

  const openAdd = () => {
    setForm({ name: '', code: '', desc: '', dataScope: '本部门' })
    setShowModal(true)
  }

  const save = () => {
    if (!form.name.trim() || !form.code.trim()) { toast('请填写角色名称和编码', 'error'); return }
    const nr: RoleItem = {
      id: genId('r'),
      code: form.code.trim(),
      name: form.name.trim(),
      desc: form.desc.trim() || '暂无描述',
      dataScope: form.dataScope,
      status: '启用',
      menuIds: [],
      userCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setRoles([...roles, nr])
    setShowModal(false)
    toast(`角色「${nr.name}」创建成功`, 'success')
  }

  const openPerm = (r: RoleItem) => {
    setEditingRole(r)
    setCheckedMenus(new Set(r.menuIds))
    setExpanded(new Set(['m1', 'm2', 'm8', 'm11']))
    setShowPermModal(true)
  }

  const toggleMenu = (id: string) => {
    setCheckedMenus(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleStatus = (id: string) => {
    setRoles(roles.map(r => r.id === id ? { ...r, status: r.status === '启用' ? '停用' : '启用' } : r))
    const r = roles.find(x => x.id === id)
    toast(`角色「${r?.name}」已${r?.status === '启用' ? '停用' : '启用'}`, 'success')
  }

  const savePerm = () => {
    if (!editingRole) return
    setRoles(roles.map(r => r.id === editingRole.id ? { ...r, menuIds: [...checkedMenus] } : r))
    setShowPermModal(false)
    toast(`角色「${editingRole.name}」权限已更新`, 'success')
  }

  const checkAllInTree = (m: MenuItem[]): boolean => m.every(x => checkedMenus.has(x.id) && (!x.children.length || checkAllInTree(x.children)))
  const setAllInTree = (list: MenuItem[], checked: boolean) => {
    setCheckedMenus(prev => {
      const next = new Set(prev)
      const walk = (l: MenuItem[]) => l.forEach(x => { checked ? next.add(x.id) : next.delete(x.id); if (x.children.length) walk(x.children) })
      walk(list)
      return next
    })
  }

  const permStep = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 24

  return (
    <div className="space-y-3 md:space-y-5">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <div className="px-3 md:px-5 py-2.5 md:py-3 flex flex-row items-center justify-between gap-2.5 border-b" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs md:text-sm flex-1 min-w-0" style={{ backgroundColor: 'var(--t-bg)', borderColor: 'var(--t-border-sub)' }}>
            <span className="flex-shrink-0" style={{ color: 'var(--t-text-mute)' }}>🔍</span>
            <input type="text" placeholder="搜索角色..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 min-w-0 w-full" style={{ color: 'var(--t-text-main)' }} />
          </div>
          <button className="flex-shrink-0 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
            onClick={openAdd}>＋ 新增</button>
        </div>

        {/* PC 表格 */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--t-bg)' }}>
              {['角色编码', '角色名称', '描述', '数据范围', '用户数', '创建时间', '状态', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-12" style={{ color: 'var(--t-text-mute)' }}>暂无匹配的角色</td></tr>
                : filtered.map(r => {
                  const dc = DATA_SCOPE_COLORS[r.dataScope] || '#999'
                  return <tr key={r.id} className="hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]">
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code style={{ color: 'var(--t-text-main)' }}>{r.code}</code></td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{r.name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{r.desc}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${dc}20`, color: dc }}>{r.dataScope}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{r.userCount}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{r.createdAt}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: r.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: r.status === '启用' ? '#10b981' : '#6b7280' }}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <button className="text-xs px-2 py-1 rounded-lg mr-1" style={{ color: '#8b5cf6' }} onClick={() => openPerm(r)}>权限</button>
                      <button className="text-xs px-2 py-1 rounded-lg mr-1" style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`编辑角色：${r.name}`, 'info')}>编辑</button>
                      <button className="text-xs px-2 py-1 rounded-lg" style={{ color: r.status === '启用' ? 'var(--t-text-sub)' : '#10b981' }} onClick={() => toggleStatus(r.id)}>
                        {r.status === '启用' ? '停用' : '启用'}
                      </button>
                    </td>
                  </tr>
                })}
            </tbody>
          </table>
        </div>

        {/* 移动端卡片列表 */}
        <div className="md:hidden divide-y" style={{ borderColor: 'var(--t-border-sub)' }}>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: 'var(--t-text-mute)' }}>暂无匹配的角色</div>
          ) : filtered.map(r => {
            const dc = DATA_SCOPE_COLORS[r.dataScope] || '#999'
            return (
              <div key={r.id} className="px-3 py-3 flex gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${dc}25, ${dc}40)` }}>🛡️</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--t-text-main)' }}>{r.name}</span>
                      <span className="inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-medium flex-shrink-0"
                        style={{ backgroundColor: 'var(--t-bg)', color: 'var(--t-text-sub)' }}>{r.code}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
                      style={{ backgroundColor: r.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: r.status === '启用' ? '#10b981' : '#6b7280' }}>{r.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
                      style={{ backgroundColor: `${dc}20`, color: dc }}>{r.dataScope}</span>
                  </div>
                  <p className="text-[11px] leading-snug line-clamp-2 mb-2" style={{ color: 'var(--t-text-sub)' }}>{r.desc}</p>
                  <div className="flex items-center gap-3 text-[10px] mb-2.5" style={{ color: 'var(--t-text-mute)' }}>
                    <span>👥 {r.userCount} 人</span>
                    <span>📅 {r.createdAt}</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                    <button onClick={() => openPerm(r)} className="flex-shrink-0 text-[11px] px-3 py-1 rounded-lg font-medium"
                      style={{ backgroundColor: 'rgba(139,92,246,0.10)', color: '#8b5cf6' }}>权限</button>
                    <button onClick={() => toast(`编辑角色：${r.name}`, 'info')} className="flex-shrink-0 text-[11px] px-3 py-1 rounded-lg font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 10%, transparent)', color: 'var(--t-accent-500)' }}>编辑</button>
                    <button onClick={() => toggleStatus(r.id)} className="flex-shrink-0 text-[11px] px-3 py-1 rounded-lg font-medium"
                      style={{ backgroundColor: 'var(--t-bg)', color: r.status === '启用' ? 'var(--t-text-sub)' : '#10b981' }}>
                      {r.status === '启用' ? '停用' : '启用'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 新增角色 */}
      {showModal && (
        <Modal title="新增角色" onClose={() => setShowModal(false)} onSave={save}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="角色名称" required><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="如 部门主管" /></Field>
            <Field label="角色编码" required><Input value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="如 R007" /></Field>
          </div>
          <Field label="数据范围">
            <select value={form.dataScope} onChange={e => setForm(f => ({ ...f, dataScope: e.target.value }))} className="input-base">
              {['全部', '自定义', '本部门', '本部门及下级', '本人'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="角色描述">
            <textarea rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="请输入角色描述" className="input-base resize-y" />
          </Field>
        </Modal>
      )}

      {/* 分配权限 */}
      {showPermModal && editingRole && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setShowPermModal(false)}>
          <div className="w-full max-w-[720px] h-[88vh] md:h-auto md:max-h-[85vh] overflow-hidden rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col animate-[slide-in-up_0.25s_ease-out]" style={{ backgroundColor: 'var(--t-card)' }} onClick={e => e.stopPropagation()}>
            <div className="md:hidden h-1.5 w-12 mx-auto mt-2 rounded-full bg-gray-300 flex-shrink-0" />
            <div className="px-4 md:px-6 py-3 md:py-5 flex items-center justify-between border-b flex-shrink-0" style={{ borderColor: 'var(--t-border-sub)' }}>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold truncate" style={{ color: 'var(--t-text-main)' }}>分配权限 - {editingRole.name}</h3>
                <p className="text-[10px] md:text-xs mt-0.5 hidden md:block" style={{ color: 'var(--t-text-sub)' }}>勾选该角色可访问的菜单、目录与按钮权限</p>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-colors flex-shrink-0" style={{ color: 'var(--t-text-mute)' }} onClick={() => setShowPermModal(false)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--t-bg)')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>✕</button>
            </div>
            <div className="px-3 md:px-4 py-2 border-b flex items-center gap-2 flex-wrap flex-shrink-0 text-xs" style={{ borderColor: 'var(--t-border-sub)' }}>
              <span className="px-2 py-1 rounded-lg font-medium flex-shrink-0" style={{ backgroundColor: 'var(--t-bg)', color: 'var(--t-text-sub)' }}>已选 {checkedMenus.size}/{allMenus.length}</span>
              <button className="px-2 py-1 rounded-lg flex-shrink-0" style={{ color: 'var(--t-accent-500)' }} onClick={() => { const ids = allMenus.map(m => m.id); setCheckedMenus(new Set(ids)) }}>全选</button>
              <button className="px-2 py-1 rounded-lg flex-shrink-0" style={{ color: 'var(--t-text-sub)' }} onClick={() => setCheckedMenus(new Set())}>清空</button>
            </div>
            <div className="px-1 md:px-2 py-2 overflow-y-auto min-h-0 flex-1">
              {renderPermTree(menus, 0, expanded, checkedMenus, toggleExpand, toggleMenu, checkAllInTree, setAllInTree, permStep)}
            </div>
            <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row justify-end gap-2 border-t flex-shrink-0" style={{ borderColor: 'var(--t-border-sub)' }}>
              <button className="flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)', color: 'var(--t-text-sub)' }} onClick={() => setShowPermModal(false)}>取消</button>
              <button className="flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }} onClick={savePerm}>保存权限</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function renderPermTree(
  list: MenuItem[], depth: number, exp: Set<string>, checked: Set<string>,
  onExpand: (id: string) => void, onCheck: (id: string) => void,
  allInTree: (l: MenuItem[]) => boolean, setAll: (l: MenuItem[], c: boolean) => void,
  step = 24,
): React.ReactNode {
  return list.map(m => {
    const hasChild = m.children.length > 0
    const isExp = exp.has(m.id)
    const isChecked = checked.has(m.id)
    const childAll = hasChild ? allInTree([m]) : false
    return (
      <div key={m.id}>
        <div className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg mx-0.5 hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]" style={{ paddingLeft: `${6 + depth * step}px` }}>
          <input type="checkbox" checked={childAll} className="w-4 h-4 rounded cursor-pointer accent-[var(--t-accent-500)] flex-shrink-0"
            onChange={e => { if (hasChild) setAll([m], e.target.checked); else onCheck(m.id) }} />
          <span className="w-5 text-center text-[11px] transition-transform flex-shrink-0" style={{ color: 'var(--t-text-mute)', visibility: hasChild ? 'visible' : 'hidden', transform: isExp ? 'rotate(90deg)' : 'rotate(0deg)' }}
            onClick={() => onExpand(m.id)}>▶</span>
          <span className="text-base md:text-base w-5 text-center flex-shrink-0">{m.icon || '📄'}</span>
          <span className="flex-1 text-xs md:text-sm cursor-pointer truncate" style={{ color: isChecked ? 'var(--t-accent-500)' : 'var(--t-text-main)', fontWeight: isChecked ? 500 : 400 }}
            onClick={() => onCheck(m.id)}>{m.name}</span>
          <code className="text-[10px] opacity-50 hidden md:inline flex-shrink-0" style={{ color: 'var(--t-text-sub)' }}>{m.code}</code>
        </div>
        {hasChild && isExp && <div className="ml-0.5 md:ml-1 border-l" style={{ borderColor: 'var(--t-border-sub)' }}>{renderPermTree(m.children, depth + 1, exp, checked, onExpand, onCheck, allInTree, setAll, step)}</div>}
      </div>
    )
  })
}
