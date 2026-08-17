import { useState, useMemo } from 'react'
import type { OrgNode, Position, UserItem, ToastFn } from '../../data/system/types'
import { getOrgById, getAllOrgsFlat, genId } from '../../data/system/utils'
import { TYPE_COLORS } from '../../data/system/Org'

type OrgTab = 'tree' | 'list'

interface Props {
  orgs: OrgNode[]
  setOrgs: (o: OrgNode[]) => void
  positions: Position[]
  users: UserItem[]
  toast: ToastFn
}

export default function OrgManage({ orgs, setOrgs, positions, users, toast }: Props) {
  const [tab, setTab] = useState<OrgTab>('tree')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['o1']))
  const [selected, setSelected] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: '部门', lead: '', parent: '' })
  const [search, setSearch] = useState('')

  const allOrgs = useMemo(() => getAllOrgsFlat(orgs), [orgs])
  const kw = search.trim().toLowerCase()
  const filteredFlatOrgs = !kw ? allOrgs : allOrgs.filter(o => o.name.toLowerCase().includes(kw) || o.code.toLowerCase().includes(kw))
  const selectedOrg = selected ? getOrgById(orgs, selected) : null

  // 搜索关键词过滤树：保留匹配节点 & 若子节点匹配则保留父节点（不自动展开，避免干扰 UI）
  const filterTree = (list: OrgNode[]): OrgNode[] => {
    if (!kw) return list
    const result: OrgNode[] = []
    for (const node of list) {
      const hit = node.name.toLowerCase().includes(kw) || node.code.toLowerCase().includes(kw)
      const child = node.children.length ? filterTree(node.children) : []
      if (hit || child.length) result.push({ ...node, children: child })
    }
    return result
  }
  const filteredTree = useMemo(() => filterTree(orgs), [orgs, kw])

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const save = () => {
    if (!form.name.trim()) { toast('请输入组织名称', 'error'); return }
    const newOrg: OrgNode = {
      id: genId('o'),
      code: 'NEW' + Math.floor(Math.random() * 1000),
      name: form.name.trim(),
      type: form.type,
      lead: form.lead.trim() || '-',
      parent: form.parent || null,
      children: [],
    }
    const addToParent = (list: OrgNode[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === form.parent) {
          list[i] = { ...list[i], children: [...list[i].children, newOrg] }; return true
        }
        if (list[i].children.length) {
          const next = [...list[i].children]
          if (addToParent(next)) { list[i] = { ...list[i], children: next }; return true }
        }
      }
      return false
    }
    const next = [...orgs]
    if (form.parent) { addToParent(next); setExpanded(p => new Set([...p, form.parent])) }
    else next.push(newOrg)
    setOrgs(next)
    setForm({ name: '', type: '部门', lead: '', parent: '' })
    setShowModal(false)
    toast(`组织「${newOrg.name}」创建成功`, 'success')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        {/* 头部：移动端 & 桌面端统一一行左右布局（搜索左 + 新增按钮右）；tab 在其下单独一行 */}
        <div className="px-4 md:px-5 py-2.5 md:py-3 flex flex-row items-center justify-between gap-2.5 border-b" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs md:text-sm flex-1 min-w-0" style={{ backgroundColor: 'var(--t-bg)', borderColor: 'var(--t-border-sub)' }}>
            <span className="flex-shrink-0" style={{ color: 'var(--t-text-mute)' }}>🔍</span>
            <input type="text" placeholder="搜索组织名称/编码..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 min-w-0 w-full" style={{ color: 'var(--t-text-main)' }} />
          </div>
          <button
            className="flex-shrink-0 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.99] whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
            onClick={() => { setForm({ name: '', type: '部门', lead: '', parent: '' }); setShowModal(true) }}
          >＋ 新增</button>
        </div>
        <div className="flex border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--t-border-sub)' }}>
          {(['tree', 'list'] as OrgTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-medium transition-colors border-b-2 -mb-px flex-shrink-0"
              style={{ color: tab === t ? 'var(--t-accent-500)' : 'var(--t-text-sub)', borderBottomColor: tab === t ? 'var(--t-accent-500)' : 'transparent' }}>
              {t === 'tree' ? '组织树' : '组织列表'}
            </button>
          ))}
        </div>

        {tab === 'tree' ? (
          <div className="p-1.5 md:p-2 max-h-[560px] md:max-h-[600px] overflow-y-auto">
            {/* PC 端宽屏 / 移动端 共用树结构，树行内信息移动端紧凑 */}
            {filteredTree.length === 0 ? (
              <div className="py-16 text-center text-xs" style={{ color: 'var(--t-text-mute)' }}>
                {kw ? `没有匹配 “${search}” 的组织` : '暂无组织数据'}
              </div>
            ) : renderTree(filteredTree, 0, expanded, selected, toggle, setSelected)}
            {selectedOrg && (
              <div className="mx-2 md:mx-3 my-3 p-3 md:p-4 rounded-xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--t-accent-500) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--t-accent-500) 25%, transparent)' }}>
                <h4 className="text-xs md:text-sm font-semibold mb-2" style={{ color: 'var(--t-text-main)' }}>📋 {selectedOrg.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 text-xs">
                  {[
                    ['组织编码', selectedOrg.code],
                    ['组织类型', selectedOrg.type],
                    ['负责人', selectedOrg.lead || '-'],
                    ['下属组织', `${selectedOrg.children.length} 个`],
                    ['岗位数', `${positions.filter(p => p.org === selectedOrg.id).length} 个`],
                    ['用户数', `${users.filter(u => u.org === selectedOrg.id).length} 人`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col md:flex-row md:items-center md:py-1">
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
            {/* PC：表格 ； 移动端：卡片列表 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--t-bg)' }}>
                    {['组织编码', '组织名称', '组织类型', '负责人', '状态', '操作'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFlatOrgs.length === 0 ? <tr><td colSpan={6} className="text-center py-12" style={{ color: 'var(--t-text-mute)' }}>{kw ? `没有匹配 “${search}” 的组织` : '暂无组织数据'}</td></tr>
                    : filteredFlatOrgs.map(o => (
                    <tr key={o.id} className="hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]">
                      <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code style={{ color: 'var(--t-text-main)' }}>{o.code}</code></td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{o.name}</td>
                      <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${TYPE_COLORS[o.type] || '#999'}20`, color: TYPE_COLORS[o.type] || '#999' }}>{o.type}</span>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{o.lead || '-'}</td>
                      <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>启用</span>
                      </td>
                      <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                        <button className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`查看详情：${o.name}`, 'info')}>详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--t-border-sub)' }}>
              {filteredFlatOrgs.length === 0 ? (
                <div className="py-16 text-center text-xs" style={{ color: 'var(--t-text-mute)' }}>{kw ? `没有匹配 “${search}” 的组织` : '暂无组织数据'}</div>
              ) : filteredFlatOrgs.map(o => (
                <div key={o.id} className="p-3.5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${TYPE_COLORS[o.type] || '#999'}18` }}>🏢</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold truncate" style={{ color: 'var(--t-text-main)' }}>{o.name}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                        style={{ backgroundColor: `${TYPE_COLORS[o.type] || '#999'}20`, color: TYPE_COLORS[o.type] || '#999' }}>{o.type}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: 'var(--t-text-sub)' }}>
                      <code>{o.code}</code>
                      <span>·</span>
                      <span>负责人 {o.lead || '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>启用</span>
                    <button className="text-[11px] px-2 py-0.5 rounded-lg"
                      style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`查看详情：${o.name}`, 'info')}>详情</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="新增组织" onClose={() => setShowModal(false)} onSave={save}>
          <Field label="组织名称" required>
            <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="请输入组织名称" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="组织类型">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-base">
                {['集团', '公司', '部门', '小组', '虚拟组'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="负责人">
              <Input value={form.lead} onChange={v => setForm(f => ({ ...f, lead: v }))} placeholder="请输入负责人姓名" />
            </Field>
          </div>
          <Field label="上级组织">
            <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="input-base">
              <option value="">-- 顶级组织 --</option>
              {allOrgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.code})</option>)}
            </select>
          </Field>
        </Modal>
      )}
    </div>
  )
}

function renderTree(list: OrgNode[], depth: number, exp: Set<string>, sel: string | null, onToggle: (id: string) => void, onSelect: (id: string) => void) {
  const step = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 24
  return list.map(o => {
    const hasChild = o.children.length > 0
    const isExp = exp.has(o.id)
    const isSel = sel === o.id
    return (
      <div key={o.id}>
        <div onClick={() => onSelect(o.id)} className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSel ? 'bg-[color-mix(in_srgb,var(--t-accent-500)_10%,transparent)]' : 'hover:bg-[color-mix(in_srgb,var(--t-accent-500)_6%,transparent)]'}`}
          style={{ paddingLeft: `${8 + depth * step}px` }}>
          <span className="w-5 text-center text-[11px] transition-transform flex-shrink-0" style={{ color: 'var(--t-text-mute)', visibility: hasChild ? 'visible' : 'hidden', transform: isExp ? 'rotate(90deg)' : 'rotate(0deg)' }}
            onClick={e => { e.stopPropagation(); onToggle(o.id) }}>▶</span>
          <span className="text-base w-5 text-center flex-shrink-0">🏢</span>
          <span className="flex-1 text-xs md:text-sm truncate min-w-0" style={{ color: isSel ? 'var(--t-accent-500)' : 'var(--t-text-main)', fontWeight: isSel ? 600 : 500 }}>{o.name}</span>
          <span className="hidden md:inline text-[11px] flex-shrink-0" style={{ color: 'var(--t-text-mute)' }}>{o.code} · {o.type}</span>
          <span className="md:hidden inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
            style={{ backgroundColor: `${(TYPE_COLORS[o.type] || '#999')}20`, color: TYPE_COLORS[o.type] || '#999' }}>{o.type}</span>
        </div>
        {hasChild && isExp && renderTree(o.children, depth + 1, exp, sel, onToggle, onSelect)}
      </div>
    )
  })
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div><label className="block text-xs md:text-sm font-medium mb-1.5" style={{ color: 'var(--t-text-main)' }}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>{children}</div>
}

export function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-base" />
}

export function Modal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className={`w-full max-w-[520px] max-h-[88vh] md:max-h-[85vh] overflow-y-auto md:rounded-2xl rounded-t-3xl shadow-2xl ${isMobile ? 'animate-[slide-in-up_0.2s_ease-out]' : ''}`}
        style={{ backgroundColor: 'var(--t-card)' }} onClick={e => e.stopPropagation()}>
        <div className="px-5 md:px-6 py-4 md:py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--t-border-sub)' }}>
          <h3 className="text-base md:text-lg font-semibold" style={{ color: 'var(--t-text-main)' }}>{title}</h3>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-colors" style={{ color: 'var(--t-text-mute)' }} onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--t-bg)')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>✕</button>
        </div>
        <div className="px-5 md:px-6 py-4 md:py-5 space-y-4">{children}</div>
        <div className="px-5 md:px-6 py-3 md:py-4 flex md:justify-end gap-2 border-t" style={{ borderColor: 'var(--t-border-sub)' }}>
          <button className="flex-1 md:flex-none md:w-auto px-4 py-2 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)', color: 'var(--t-text-sub)' }} onClick={onClose}>取消</button>
          <button className="flex-1 md:flex-none md:w-auto px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }} onClick={onSave}>保存</button>
        </div>
      </div>
    </div>
  )
}
