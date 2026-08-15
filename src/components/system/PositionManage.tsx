import { useState, useMemo } from 'react'
import type { OrgNode, Position, ToastFn } from './systemData'
import { getOrgById, getAllOrgsFlat, genId, LEVEL_COLORS } from './systemData'
import { Field, Input, Modal } from './OrgManage'

interface Props {
  orgs: OrgNode[]
  positions: Position[]
  setPositions: (p: Position[]) => void
  toast: ToastFn
}

export default function PositionManage({ orgs, positions, setPositions, toast }: Props) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', level: 'M1', org: getAllOrgsFlat(orgs)[0]?.id || '', desc: '' })

  const filtered = useMemo(() => positions.filter(p => p.name.toLowerCase().includes(search.toLowerCase())), [positions, search])
  const allOrgs = getAllOrgsFlat(orgs)

  const save = () => {
    if (!form.name.trim()) { toast('请输入岗位名称', 'error'); return }
    const np: Position = {
      id: genId('p'),
      code: 'J' + Math.floor(Math.random() * 1000),
      name: form.name.trim(),
      level: form.level,
      org: form.org,
      desc: form.desc.trim() || '暂无描述',
      status: '启用',
    }
    setPositions([...positions, np])
    setForm({ name: '', level: 'M1', org: allOrgs[0]?.id || '', desc: '' })
    setShowModal(false)
    toast(`岗位「${np.name}」创建成功`, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <div className="px-5 py-4 flex items-center justify-between border-b flex-wrap gap-3" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold" style={{ color: 'var(--t-text-main)' }}>💼 岗位管理</h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--t-bg)', borderColor: 'var(--t-border-sub)' }}>
              <span style={{ color: 'var(--t-text-mute)' }}>🔍</span>
              <input type="text" placeholder="搜索岗位名称..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-44" style={{ color: 'var(--t-text-main)' }} />
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
            onClick={() => { setForm({ name: '', level: 'M1', org: allOrgs[0]?.id || '', desc: '' }); setShowModal(true) }}>＋ 新增岗位</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--t-bg)' }}>
              {['岗位编码', '岗位名称', '级别', '所属组织', '状态', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-12" style={{ color: 'var(--t-text-mute)' }}>暂无匹配的岗位</td></tr>
                : filtered.map(p => {
                  const org = getOrgById(orgs, p.org)
                  const lc = LEVEL_COLORS[p.level] || '#999'
                  return <tr key={p.id} className="hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]">
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code style={{ color: 'var(--t-text-main)' }}>{p.code}</code></td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{p.name}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${lc}20`, color: lc }}>{p.level}</span></td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{org ? org.name : '-'}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: p.status === '启用' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)', color: p.status === '启用' ? '#10b981' : '#6b7280' }}>{p.status}</span></td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <button className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`编辑岗位：${p.name}`, 'info')}>编辑</button>
                    </td>
                  </tr>
                })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="新增岗位" onClose={() => setShowModal(false)} onSave={save}>
          <Field label="岗位名称" required><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="请输入岗位名称" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="岗位级别">
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="input-base">
                {['P1', 'P2', 'P3', 'P4', 'P5', 'M1（经理）', 'M2（高级经理）', 'M3（总监）'].map(l => { const v = l.split('（')[0]; return <option key={v} value={v}>{l}</option> })}
              </select>
            </Field>
            <Field label="所属组织">
              <select value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} className="input-base">
                {allOrgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.code})</option>)}
              </select>
            </Field>
          </div>
          <Field label="职责说明">
            <textarea rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="请输入岗位职责说明" className="input-base resize-y" />
          </Field>
        </Modal>
      )}
    </div>
  )
}
