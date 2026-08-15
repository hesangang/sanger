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
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <div className="px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-between gap-3 border-b" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex rounded-lg border overflow-hidden w-fit flex-shrink-0" style={{ borderColor: 'var(--t-border-sub)' }}>
            {(['tree', 'list'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: view === v ? 'var(--t-accent-500)' : 'transparent', color: view === v ? '#fff' : 'var(--t-text-sub)' }}>
                {v === 'tree' ? '🌳 树形' : '📜 列表'}
              </button>
            ))}
          </div>
          <button className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
            onClick={() => { setForm({ name: '', code: '', type: '菜单', parent: '', path: '', icon: '', sort: 1, perm: '' }); setShowModal(true) }}>＋ 新增菜单</button>
        </div>

        {view === 'tree' ? (
          <div className="p-1.5 md:p-2 max-h-[560px] md:max-h-[600px] overflow-y-auto">
            {renderMenuTree(menus, 0, expanded, selected, toggle, setSelected, toggleStatus, toast)}
            {selectedMenu && (
              <div className="mx-2 md:mx-3 my-3 p-3 md:p-4 rounded-xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--t-accent-500) 25%, transparent)' }}>
                <h4 className="text-xs md:text-sm font-semibold mb-2" style={{ color: 'var(--t-text-main)' }}>📋 {selectedMenu.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 text-xs">
                  {[
                    ['菜单编码', selectedMenu.code],
                    ['菜单类型', selectedMenu.type],
                    ['路由地址', selectedMenu.path || '-'],
                    ['权限标识', selectedMenu.perm || '-'],
                    ['显示排序', String(selectedMenu.sort)],
                    ['子菜单数', `${selectedMenu.children.length} 个`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col md:flex-row md:items-center">
                      <span className="flex-shrink-0" style={{ color: 'var(--t-text-sub)' }}>{k}</span>
                      <span className="md:ml-1" style={{ color: 'var(--t-text-main)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* PC 列表表格 */}
            <div className="hidden md:block overflow-x-auto">
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
            {/* APP：层级卡片（扁平 + 缩进，体现层级） */}
            <div className="md:hidden">
              {allMenus.length === 0 ? (
                <div className="text-center py-10 text-xs" style={{ color: 'var(--t-text-mute)' }}>暂无菜单</div>
              ) : (
                <MenuCardList menus={menus} toggleStatus={toggleStatus} toast={toast} depth={0} />
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="新增菜单" onClose={() => setShowModal(false)} onSave={save}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="菜单名称" required><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="如 组织管理" /></Field>
            <Field label="菜单编码" required><Input value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="如 M008" /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="路由地址"><Input value={form.path} onChange={v => setForm(f => ({ ...f, path: v }))} placeholder="如 /system/org" /></Field>
            <Field label="图标(emoji)"><Input value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} placeholder="如 🏗️" /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

function MenuCardList({ menus, depth, toggleStatus, toast }: {
  menus: MenuItem[]; depth: number;
  toggleStatus: (id: string) => void; toast: ToastFn;
}) {
  const step = typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24
  return (
    <div className="divide-y" style={{ borderColor: 'var(--t-border-sub)' }}>
      {menus.map(m => {
        const tc = MENU_TYPE_COLORS[m.type] || '#999'
        const indent = 4 + depth * step
        return (
          <div key={m.id}>
            <div className="p-3 flex items-start gap-2.5" style={{ paddingLeft: `${indent}px` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${tc}15` }}>
                <span className={m.status === '停用' ? 'opacity-40' : ''}>{m.icon || '📄'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[14px] font-semibold truncate"
                    style={{ color: m.status === '停用' ? 'var(--t-text-mute)' : 'var(--t-text-main)' }}>{m.name}</span>
                  <span className="inline-flex px-1.5 py-px rounded-full text-[10px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: `${tc}20`, color: tc }}>{m.type}</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: m.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: m.status === '启用' ? '#10b981' : '#6b7280' }}>{m.status}</span>
                </div>
                <div className="mt-0.5 text-[11px] flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: 'var(--t-text-sub)' }}>
                  <code>{m.code}</code>
                  {m.path && <><span>·</span><code className="truncate max-w-[140px]">{m.path}</code></>}
                  {m.perm && <><span>·</span><span className="truncate max-w-[120px]">{m.perm}</span></>}
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ color: 'var(--t-accent-500)', backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 10%, transparent)' }} onClick={() => toast(`编辑：${m.name}`, 'info')}>编辑</button>
                  <button className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                    style={{ color: m.status === '启用' ? 'var(--t-text-sub)' : '#10b981', backgroundColor: 'var(--t-bg)' }}
                    onClick={() => toggleStatus(m.id)}>{m.status === '启用' ? '停用' : '启用'}</button>
                </div>
              </div>
            </div>
            {m.children.length > 0 && (
              <MenuCardList menus={m.children} depth={depth + 1} toggleStatus={toggleStatus} toast={toast} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function renderMenuTree(
  list: MenuItem[], depth: number, exp: Set<string>, sel: string | null,
  onToggle: (id: string) => void, onSelect: (id: string) => void,
  onToggleStatus: (id: string) => void, toast: ToastFn,
) {
  const step = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 24
  return list.map(m => {
    const hasChild = m.children.length > 0
    const isExp = exp.has(m.id)
    const isSel = sel === m.id
    const tc = MENU_TYPE_COLORS[m.type] || '#999'
    return (
      <div key={m.id}>
        <div onClick={() => onSelect(m.id)} className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg mx-1 cursor-pointer transition-colors ${isSel ? 'bg-[color-mix(in_srgb,var(--t-accent-500)_10%,transparent)]' : 'hover:bg-[color-mix(in_srgb,var(--t-accent-500)_6%,transparent)]'}`}
          style={{ paddingLeft: `${8 + depth * step}px` }}>
          <span className="w-5 text-center text-[11px] transition-transform flex-shrink-0" style={{ color: 'var(--t-text-mute)', visibility: hasChild ? 'visible' : 'hidden', transform: isExp ? 'rotate(90deg)' : 'rotate(0deg)' }}
            onClick={e => { e.stopPropagation(); onToggle(m.id) }}>▶</span>
          <span className="text-base w-5 text-center flex-shrink-0">{m.icon || '📄'}</span>
          <span className="flex-1 text-xs md:text-sm truncate min-w-0" style={{ color: isSel ? 'var(--t-accent-500)' : 'var(--t-text-main)', fontWeight: isSel ? 600 : 500 }}>{m.name}</span>
          <span className="md:hidden inline-flex px-1.5 py-px rounded-full text-[10px] font-semibold flex-shrink-0"
            style={{ backgroundColor: `${tc}20`, color: tc }}>{m.type}</span>
          <span className="hidden md:inline-flex px-1.5 py-px rounded-full text-[10px] font-medium flex-shrink-0" style={{ backgroundColor: `${tc}20`, color: tc }}>{m.type}</span>
          <span className={`md:hidden inline-flex text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${m.status === '停用' ? 'opacity-70' : ''}`}
            style={{ backgroundColor: m.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: m.status === '启用' ? '#10b981' : '#6b7280' }}>{m.status === '启用' ? '启' : '停'}</span>
          <span className="hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: m.status === '启用' ? '#10b981' : '#6b7280' }}>{m.status}</span>
          <span className="hidden md:inline-flex items-center gap-1 flex-shrink-0">
            <button className="text-[11px] px-1.5 py-0.5 rounded opacity-60 hover:opacity-100" style={{ color: 'var(--t-accent-500)' }}
              onClick={e => { e.stopPropagation(); toast(`编辑：${m.name}`, 'info') }}>编辑</button>
            <button className="text-[11px] px-1.5 py-0.5 rounded opacity-60 hover:opacity-100" style={{ color: m.status === '启用' ? 'var(--t-text-sub)' : '#10b981' }}
              onClick={e => { e.stopPropagation(); onToggleStatus(m.id) }}>{m.status === '启用' ? '停' : '启'}</button>
          </span>
        </div>
        {hasChild && isExp && renderMenuTree(m.children, depth + 1, exp, sel, onToggle, onSelect, onToggleStatus, toast)}
      </div>
    )
  })
}
