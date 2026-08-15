import { useState, useMemo } from 'react'
import type { OrgNode, Position, UserItem, ToastFn } from './systemData'
import { getOrgById, genId, AVATAR_COLORS } from './systemData'
import { Field, Input, Modal } from './OrgManage'

interface Props {
  orgs: OrgNode[]
  positions: Position[]
  users: UserItem[]
  setUsers: (u: UserItem[]) => void
  toast: ToastFn
}

export default function UserManage({ orgs, positions, users, setUsers, toast }: Props) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', phone: '', email: '', org: orgs[0]?.id || '', pos: positions[0]?.id || '' })

  const filtered = useMemo(() => users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.code.toLowerCase().includes(search.toLowerCase())), [users, search])

  const save = () => {
    if (!form.name.trim() || !form.code.trim()) { toast('请填写姓名和工号', 'error'); return }
    const nu: UserItem = {
      id: genId('u'),
      name: form.name.trim(),
      code: form.code.trim(),
      phone: form.phone.trim() || '-',
      email: form.email.trim() || '-',
      org: form.org, pos: form.pos,
      status: '正常',
      avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
    }
    setUsers([...users, nu])
    setForm({ name: '', code: '', phone: '', email: '', org: orgs[0]?.id || '', pos: positions[0]?.id || '' })
    setShowModal(false)
    toast(`用户「${nu.name}」创建成功`, 'success')
  }

  const exportUsers = () => {
    const csv = ['姓名,工号,手机号,邮箱,主组织,主岗位,状态']
      + users.map(u => {
        const o = getOrgById(orgs, u.org)
        const p = positions.find(x => x.id === u.pos)
        return [u.name, u.code, u.phone, u.email, o ? o.name : '', p ? p.name : '', u.status].join(',')
      }).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '用户数据.csv'
    a.click()
    toast('用户数据已导出', 'success')
  }

  const resetPassword = (id: string) => {
    const u = users.find(x => x.id === id)
    if (u) toast(`已向 ${u.name} 发送密码重置通知`, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <div className="px-5 py-4 flex items-center justify-between border-b flex-wrap gap-3" style={{ borderColor: 'var(--t-border-sub)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold" style={{ color: 'var(--t-text-main)' }}>👤 用户管理</h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--t-bg)', borderColor: 'var(--t-border-sub)' }}>
              <span style={{ color: 'var(--t-text-mute)' }}>🔍</span>
              <input type="text" placeholder="搜索姓名/工号..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-44" style={{ color: 'var(--t-text-main)' }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))', boxShadow: `0 10px 24px -12px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` }}
              onClick={() => { setForm({ name: '', code: '', phone: '', email: '', org: orgs[0]?.id || '', pos: positions[0]?.id || '' }); setShowModal(true) }}>＋ 新增用户</button>
            <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-bg)', color: 'var(--t-text-sub)' }} onClick={exportUsers}>⬇ 导出</button>
            <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-bg)', color: 'var(--t-text-sub)' }} onClick={() => toast('导入功能开发中，请使用导出模板', 'info')}>⬆ 导入</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--t-bg)' }}>
              {['', '用户姓名', '工号', '手机号', '主组织', '主岗位', '状态', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-sub)', borderBottom: '1px solid var(--t-border-sub)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-12" style={{ color: 'var(--t-text-mute)' }}>暂无匹配的用户</td></tr>
                : filtered.map(u => {
                  const org = getOrgById(orgs, u.org)
                  const pos = positions.find(p => p.id === u.pos)
                  const sMap: Record<string, [string, string, string]> = {
                    '正常': ['rgba(16,185,129,0.12)', '#10b981', '🟢'],
                    '冻结': ['rgba(239,68,68,0.12)', '#ef4444', '🔴'],
                    '停用': ['rgba(156,163,175,0.12)', '#6b7280', '⚪'],
                  }
                  const [sBg, sColor, sIcon] = sMap[u.status] || sMap['正常']
                  return <tr key={u.id} className="hover:bg-[color-mix(in_srgb,var(--t-accent-500)_4%,transparent)]">
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: u.avatarColor }}>{u.name.charAt(0)}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{u.name}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}><code style={{ color: 'var(--t-text-main)' }}>{u.code}</code></td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{u.phone}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{org ? org.name : '-'}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--t-text-main)', borderBottom: '1px solid var(--t-border-sub)' }}>{pos ? pos.name : '-'}</td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sBg, color: sColor }}>{sIcon} {u.status}</span>
                    </td>
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border-sub)' }}>
                      <button className="text-xs px-2 py-1 rounded-lg mr-1" style={{ color: 'var(--t-accent-500)' }} onClick={() => toast(`编辑用户：${u.name}`, 'info')}>编辑</button>
                      <button className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-sub)' }} onClick={() => resetPassword(u.id)}>重置密码</button>
                    </td>
                  </tr>
                })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="新增用户" onClose={() => setShowModal(false)} onSave={save}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="姓名" required><Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="请输入姓名" /></Field>
            <Field label="工号" required><Input value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="如 A1001" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="手机号"><Input value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="请输入手机号" /></Field>
            <Field label="邮箱"><Input value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="name@company.com" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="主组织">
              <select value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} className="input-base">
                {(() => { const r: OrgNode[] = []; function w(l: OrgNode[]) { for (const o of l) { r.push(o); if (o.children) w(o.children) } } w(orgs); return r })()
                  .map(o => <option key={o.id} value={o.id}>{o.name} ({o.code})</option>)}
              </select>
            </Field>
            <Field label="主岗位">
              <select value={form.pos} onChange={e => setForm(f => ({ ...f, pos: e.target.value }))} className="input-base">
                {positions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </div>
  )
}
