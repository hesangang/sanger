import type { OrgNode, Position, UserItem } from './systemData'
import { getAllOrgsFlat, TYPE_COLORS } from './systemData'

interface Props {
  orgs: OrgNode[]
  positions: Position[]
  users: UserItem[]
  onJump: (key: string) => void
}

export default function Dashboard({ orgs, positions, users, onJump }: Props) {
  const allOrgs = getAllOrgsFlat(orgs)
  const stats = { org: allOrgs.length, user: users.length, pos: positions.length }

  const orgLevels: Record<string, number> = {}
  allOrgs.forEach(o => { orgLevels[o.type] = (orgLevels[o.type] || 0) + 1 })
  const maxLevel = Math.max(...Object.values(orgLevels), 1)

  const userStatuses: Record<string, number> = {}
  users.forEach(u => { userStatuses[u.status] = (userStatuses[u.status] || 0) + 1 })

  const cards = [
    { key: 'org', icon: '🏗️', color: '#4f6ef7', title: '组织管理', desc: '查看组织架构树，管理组织单元信息' },
    { key: 'position', icon: '💼', color: '#f59e0b', title: '岗位管理', desc: '定义岗位角色、级别与职责说明' },
    { key: 'user', icon: '👤', color: '#10b981', title: '用户管理', desc: '管理用户账号、状态与组织归属' },
    { key: 'menu', icon: '📋', color: '#8b5cf6', title: '菜单管理', desc: '配置系统菜单、目录与按钮权限' },
    { key: 'role', icon: '🛡️', color: '#ec4899', title: '角色管理', desc: '定义角色与数据权限范围' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🏢', bg: 'rgba(79,110,247,0.12)', c: '#4f6ef7', label: '组织单元数', v: stats.org },
          { icon: '👤', bg: 'rgba(16,185,129,0.12)', c: '#10b981', label: '系统用户数', v: stats.user },
          { icon: '💼', bg: 'rgba(245,158,11,0.12)', c: '#f59e0b', label: '岗位定义数', v: stats.pos },
          { icon: '🛡️', bg: 'rgba(236,72,153,0.12)', c: '#ec4899', label: '系统角色数', v: 6 },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-5 transition-transform hover:-translate-y-0.5" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: s.bg, color: s.c }}>{s.icon}</div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--t-text-main)' }}>{s.v}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--t-text-sub)' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--t-text-main)' }}>📋 功能入口</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(c => (
            <button key={c.key} onClick={() => onJump(c.key)} className="text-left rounded-2xl border p-5 transition-all hover:-translate-y-0.5" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-bg)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.icon}</div>
                <div>
                  <div className="text-base font-semibold mb-1" style={{ color: 'var(--t-text-main)' }}>{c.title}</div>
                  <div className="text-sm" style={{ color: 'var(--t-text-sub)' }}>{c.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--t-text-main)' }}>📊 数据分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--t-text-main)' }}>各组织层级分布</h4>
            <div className="space-y-2.5">
              {Object.entries(orgLevels).map(([type, count]) => {
                const c = TYPE_COLORS[type] || '#999'
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                    <span className="flex-1 text-sm" style={{ color: 'var(--t-text-main)' }}>{type}</span>
                    <span className="font-semibold text-sm w-8 text-right" style={{ color: 'var(--t-text-main)' }}>{count}</span>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--t-bg)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / maxLevel) * 100}%`, backgroundColor: c }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--t-text-main)' }}>用户状态分布</h4>
            <div className="space-y-2.5">
              {Object.entries(userStatuses).map(([status, count]) => {
                const c: Record<string, string> = { '正常': '#10b981', '冻结': '#ef4444', '停用': '#9ca3af' }
                return (
                  <div key={status} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c[status] || '#999' }} />
                    <span className="flex-1 text-sm" style={{ color: 'var(--t-text-main)' }}>{status}</span>
                    <span className="font-semibold text-sm w-8 text-right" style={{ color: 'var(--t-text-main)' }}>{count}</span>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--t-bg)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / users.length) * 100}%`, backgroundColor: c[status] || '#999' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
