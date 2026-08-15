import { useState } from 'react'
import type { MenuItem, ToastFn } from './systemData'
import { getMenuById, getAllMenusFlat, genId, MENU_TYPE_COLORS } from './systemData'
import { Field, Input, Modal } from './OrgManage'

interface Props {
  menus: MenuItem[]
  setMenus: (m: MenuItem[]) => void
  toast: ToastFn
}

type ViewMode = 'tree' | 'list'

export default function MenuManage({ menus, setMenus, toast }: Props) {
  const [view, setView] = useState<ViewMode>('tree')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['m1', 'm2', 'm8']))
  const [selected, setSelected] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', type: '菜单' as MenuItem['type'], parent: '', path: '', icon: '', sort: 1, perm: '' })
  const allMenus = getAllMenusFlat(menus)
  const selectedMenu = selected ? getMenuById(menus, selected) : null

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const save = () => {
    if (!form.name.trim() || !form.code.trim()) { toast('请填写菜单名称和编码', 'error'); return }
    const newM: MenuItem = {
      id: genId('m'),
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      parent: form.parent || null,
      path: form.path.trim(),
      icon: form.icon.trim(),
      sort: form.sort,
      status: '启用',
      perm: form.perm.trim(),
      children: [],
    }
    const addTo = (list: MenuItem[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === form.parent) {
          list[i] = { ...list[i], children: [...list[i].children, newM] }; return true
        }
        if (list[i].children.length) {
          const next = [...list[i].children]
          if (addTo(next)) { list[i] = { ...list[i], children: next }; return true }
        }
      }
      return false
    }
    const next = [...menus]
    if (form.parent) { addTo(next); setExpanded(p => new Set([...p, form.parent])) }
    else next.push(newM)
    setMenus(next)
    setShowModal(false)
    toast(`菜单「${newM.name}」创建成功`, 'success')
  }

  const toggleStatus = (id: string) => {
    const update = (list: MenuItem[]): MenuItem[] => list.map(m => {
      if (m.id === id) return { ...m, status: m.status === '启用' ? '停用' : '启用' }
      return { ...m, children: update(m.children) }
    })
    setMenus(update(menus))
    const mm = getMenuById(menus, id)
    toast(`菜单「${mm?.name}」已${mm?.status === '启用' ? '停用' : '启用'}`, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <div className="px-5 py-4 flex items-center justify-between border-b flex-wrap gap-3" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold" style={{ color: 'var(--t-text-main)' }}>📋 菜单管理</h3>
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)' }}>
              {(['tree', 'list'] as ViewMode[]).map(v => (
                <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ backgroundColor: view === v ? 'var(--t-accent-500)' : 'transparent', color: view === v ? '#fff' : 'var(--t-text-sub)' }}>
                  {v === 'tree' ? '🌳 树形' : '📜 列表'}
                </button>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
            onClick={() => { setForm({ name: '', code: '', type: '菜单', parent: '', path: '', icon: '', sort: 1, perm: '' }); setShowModal(true) }}>＋ 新增菜单</button>
        </div>

        <div style={{ display: view === 'tree' ? '' : 'none' }}>
          <div className="p-2 max-h-[600px] overflow-y-auto">
            {renderMenuTree(menus, 0, expanded, selected, toggle, setSelected, toggleStatus, toast)}
            {selectedMenu && (
              <div className="mx-3 my-3 p-4 rounded-xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--t-accent-500) 25%, transparent)' }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--t-text-main)' }}>📋 {selectedMenu.name} 详情</h4>
                {[
                  ['菜单编码', selectedMenu.code],
                  ['菜单类型', selectedMenu.type],
                  ['路由地址', selectedMenu.path || '-'],
                  ['权限标识', selectedMenu.perm || '-'],
                  ['显示排序', String(selectedMenu.sort)],
                  ['子菜单数', `${selectedMenu.children.length} 个`],
                ].map(([k, v]) => (
                  <div key={k} className="flex py-1 text-xs">
                    <span className="w-20 flex-shrink-0" style={{ color: 'var(--t-text-sub)' }}>{k}</span>
                    <span style={{ color: 'var(--t-text-main)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: view === 'list' ? '' : 'none' }} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--t-bg)' }}>
              {['菜单名称', '编码', '类型', '图标', '路由', '权限', '排序', '状态', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {allMenus.map(m => {
                const tc = MENU_TYPE_COLORS[m.type] || '#999'
                return <tr key={m.id} className="hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]">
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{m.icon} {m.name}</td>
                  <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code style={{ color: 'var(--t-text-main)' }}>{m.code}</code></td>
                  <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${tc}20`, color: tc }}>{m.type}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{m.icon || '-'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}><code className="text-xs">{m.path || '-'}</code></td>
                  <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code className="text-xs" style={{ color: 'var(--t-text-sub)' }}>{m.perm || '-'}</code></td>
                  <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{m.sort}</td>
                  <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: m.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: m.status === '启用' ? '#10b981' : '#6b7280' }}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                    <button className="text-xs px-2 py-1 rounded-lg mr-1" style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`编辑：${m.name}`, 'info')}>编辑</button>
                    <button className="text-xs px-2 py-1 rounded-lg" style={{ color: m.status === '启用' ? 'var(--t-text-sub)' : '#10b981' }} onClick={() => toggleStatus(m.id)}>
                      {m.status === '启用' ? '停用' : '启用'}
                    </button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="新增菜单" onClose={() => setShowModal(false)} onSave={save}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="菜单名称" required><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="如 组织管理" /></Field>
            <Field label="菜单编码" required><Input value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="如 M008" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="菜单类型">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MenuItem['type'] }))} className="input-base">
                {['目录', '菜单', '按钮'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="上级菜单">
              <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="input-base">
                <option value="">-- 顶级 --</option>
                {allMenus.filter(m => m.type !== '按钮').map(o => <option key={o.id} value={o.id}>{o.icon} {o.name} ({o.code})</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="路由地址"><Input value={form.path} onChange={v => setForm(f => ({ ...f, path: v }))} placeholder="如 /system/org" /></Field>
            <Field label="图标(emoji)"><Input value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} placeholder="如 🏗️" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="显示排序">
              <input type="number" value={form.sort} onChange={e => setForm(f => ({ ...f, sort: Number(e.target.value) || 0 }))} className="input-base" />
            </Field>
            <Field label="权限标识"><Input value={form.perm} onChange={v => setForm(f => ({ ...f, perm: v }))} placeholder="如 system:org" /></Field>
          </div>
        </Modal>
      )}
    </div>
  )
}

function renderMenuTree(
  list: MenuItem[], depth: number, exp: Set<string>, sel: string | null,
  onToggle: (id: string) => void, onSelect: (id: string) => void,
  onToggleStatus: (id: string) => void, toast: ToastFn,
) {
  return list.map(m => {
    const hasChild = m.children.length > 0
    const isExp = exp.has(m.id)
    const isSel = sel === m.id
    const tc = MENU_TYPE_COLORS[m.type] || '#999'
    return (
      <div key={m.id}>
        <div onClick={() => onSelect(m.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg mx-1 cursor-pointer transition-colors ${isSel ? 'bg-[color-mix(in_srgb,var(--t-accent-500)_10%,transparent)]' : 'hover:bg-[color-mix(in_srgb,var(--t-accent-500)_6%,transparent)]'}`}
          style={{ paddingLeft: `${8 + depth * 24}px` }}>
          <span className="w-5 text-center text-[11px] transition-transform" style={{ color: 'var(--t-text-mute)', visibility: hasChild ? 'visible' : 'hidden', transform: isExp ? 'rotate(90deg)' : 'rotate(0deg)' }}
            onClick={e => { e.stopPropagation(); onToggle(m.id) }}>▶</span>
          <span className="text-base w-5 text-center">{m.icon || '📄'}</span>
          <span className="flex-1 text-sm truncate" style={{ color: isSel ? 'var(--t-accent-500)' : 'var(--t-text-main)', fontWeight: isSel ? 500 : 400 }}>{m.name}</span>
          <span className="inline-flex px-1.5 py-px rounded-full text-[10px] font-medium" style={{ backgroundColor: `${tc}20`, color: tc }}>{m.type}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${m.status === '停用' ? 'opacity-60' : ''}`} style={{ backgroundColor: m.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: m.status === '启用' ? '#10b981' : '#6b7280' }}>{m.status}</span>
          <button className="text-[11px] px-1.5 py-0.5 rounded opacity-60 hover:opacity-100" style={{ color: 'var(--t-accent-500)' }}
            onClick={e => { e.stopPropagation(); toast(`编辑：${m.name}`, 'info') }}>编辑</button>
          <button className="text-[11px] px-1.5 py-0.5 rounded opacity-60 hover:opacity-100" style={{ color: m.status === '启用' ? 'var(--t-text-sub)' : '#10b981' }}
            onClick={e => { e.stopPropagation(); onToggleStatus(m.id) }}>{m.status === '启用' ? '停' : '启'}</button>
        </div>
        {hasChild && isExp && renderMenuTree(m.children, depth + 1, exp, sel, onToggle, onSelect, onToggleStatus, toast)}
      </div>
    )
  })
}
