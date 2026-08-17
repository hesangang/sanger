import { useState, useCallback } from 'react'
import Org from './system/Org'
import Position from './system/Position'
import User from './system/User'
import Menu from './system/Menu'
import Role from './system/Role'
import {
  INITIAL_ORG, INITIAL_POSITIONS, INITIAL_USERS, INITIAL_MENUS, INITIAL_ROLES,
  MENU_ID_TO_CONTENT,
  CONTENT_JUMP_MAP,
  MOBILE_SYSTEM_TABS,
  INITIAL_DIR_EXPANDED,
  DEFAULT_ACTIVE_MENU,
  DEFAULT_CONTENT_KEY,
} from '../data/System'
import type { OrgNode, Position as PositionItem, UserItem, MenuItem, RoleItem, ContentKey } from '../data/System'

function filterEnabledMenus(list: MenuItem[]): MenuItem[] {
  return list
    .filter(m => m.status !== '停用')
    .map(m => ({ ...m, children: filterEnabledMenus(m.children) }))
}

export default function System() {
  const [contentKey, setContentKey] = useState<ContentKey>(DEFAULT_CONTENT_KEY)
  const [activeMenuId, setActiveMenuId] = useState<string>(DEFAULT_ACTIVE_MENU)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(INITIAL_DIR_EXPANDED))
  const [orgs, setOrgs] = useState<OrgNode[]>(INITIAL_ORG)
  const [positions, setPositions] = useState<PositionItem[]>(INITIAL_POSITIONS)
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)
  const [menus] = useState<MenuItem[]>(() =>
    filterEnabledMenus(INITIAL_MENUS.filter(m => m.id !== 'm1')),
  )
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES)
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([])

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warn' = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const handleJump = (key: string) => {
    const entry = CONTENT_JUMP_MAP[key]
    if (entry) {
      setContentKey(entry[0])
      setActiveMenuId(entry[1])
      setExpandedDirs(prev => new Set([...prev, ...INITIAL_DIR_EXPANDED]))
    }
  }

  const toggleDir = (dirId: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev)
      next.has(dirId) ? next.delete(dirId) : next.add(dirId)
      return next
    })
  }

  const handleMenuClick = (m: MenuItem) => {
    if (m.type === '按钮') return
    if (m.type === '目录') {
      toggleDir(m.id)
      return
    }
    const ck = MENU_ID_TO_CONTENT[m.id]
    if (ck) {
      setContentKey(ck)
      setActiveMenuId(m.id)
    } else {
      toast(`「${m.name}」模块开发中…`, 'info')
    }
  }

  return (
    <div>
      <div className="flex gap-4 items-start">
        <aside className="w-[220px] lg:w-[235px] flex-shrink-0 hidden md:block sticky top-2">
          <nav className="rounded-2xl border p-2" style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
            <div className="space-y-0.5 py-1">
              {menus.map(root => renderRootMenuItem(root, expandedDirs, activeMenuId, handleMenuClick))}
            </div>
          </nav>
        </aside>

        <div className="md:hidden fixed bottom-16 left-2 right-2 z-40 rounded-2xl border shadow-lg p-2 overflow-x-auto scrollbar-hide flex gap-1"
             style={{ borderColor: 'var(--t-border-sub)', backgroundColor: 'var(--t-card)' }}>
          {MOBILE_SYSTEM_TABS.map(x => {
            const isActive = contentKey === x.k
            return (
              <button key={x.m} onClick={handleJump.bind(null, x.k)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'color-mix(in srgb, var(--t-accent-500) 15%, transparent)' : 'transparent',
                  color: isActive ? 'var(--t-accent-600)' : 'var(--t-text-sub)',
                }}>
                <span className="text-lg">{x.i}</span>
                <span>{x.l}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-w-0 pb-24 md:pb-0">
          {contentKey === 'org' && <Org orgs={orgs} setOrgs={setOrgs} positions={positions} users={users} toast={toast} />}
          {contentKey === 'position' && <Position orgs={orgs} positions={positions} setPositions={setPositions} toast={toast} />}
          {contentKey === 'user' && <User orgs={orgs} positions={positions} users={users} setUsers={setUsers} toast={toast} />}
          {contentKey === 'menu' && <Menu menus={INITIAL_MENUS} setMenus={() => {}} toast={toast} />}
          {contentKey === 'role' && <Role roles={roles} setRoles={setRoles} menus={INITIAL_MENUS} toast={toast} />}
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="px-5 py-3 rounded-xl text-sm text-white shadow-xl"
               style={{ backgroundColor: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : 'var(--t-accent-500)' }}>
            {t.message}
          </div>
        ))}
      </div>

      <style>{`
        .input-base {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--t-border-sub);
          border-radius: 10px;
          font-size: 13px;
          outline: none;
          transition: border .2s, box-shadow .2s;
          font-family: inherit;
          color: var(--t-text-main);
          background-color: var(--t-card);
        }
        .input-base:focus {
          border-color: var(--t-accent-500);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-accent-500) 10%, transparent);
        }
        .input-base option { background: var(--t-card); color: var(--t-text-main); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

function renderRootMenuItem(
  root: MenuItem,
  expandedDirs: Set<string>,
  activeMenuId: string,
  onMenuClick: (m: MenuItem) => void,
): React.ReactNode {
  if (root.type === '按钮') return null

  const isDir = root.type === '目录'
  const isExpanded = expandedDirs.has(root.id)

  const hasActiveChild = (list: MenuItem[]): boolean => list.some(c => c.id === activeMenuId || hasActiveChild(c.children || []))
  const dirHasActive = isDir && hasActiveChild(root.children)
  const isActive = root.id === activeMenuId

  return (
    <div key={root.id}>
      <button
        onClick={() => onMenuClick(root)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))'
            : dirHasActive
              ? 'color-mix(in srgb, var(--t-accent-500) 10%, transparent)'
              : 'transparent',
          color: isActive ? '#fff' : 'var(--t-text-sub)',
          boxShadow: isActive ? `0 8px 20px -10px color-mix(in srgb, var(--t-accent-500) 60%, transparent)` : 'none',
        }}
      >
        <span className={`w-5 text-center text-sm transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{root.icon || '📄'}</span>
        <span className={`flex-1 text-left truncate ${isActive ? '' : dirHasActive ? 'font-semibold' : ''}`}
              style={{ color: isActive ? '#fff' : dirHasActive ? 'var(--t-text-main)' : undefined }}>
          {root.name}
        </span>
        {isDir && (
          <span className="text-[10px] transition-transform"
                style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--t-text-mute)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        )}
        {isActive && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-l-full" style={{ backgroundColor: '#fff' }} />}
      </button>

      {isDir && isExpanded && root.children.length > 0 && (
        <div className="ml-2 mt-0.5 mb-1 space-y-0.5 pl-2 border-l" style={{ borderColor: 'var(--t-border-sub)' }}>
          {root.children.map(child => {
            if (child.type === '按钮') return null
            const childIsActive = child.id === activeMenuId
            return (
              <button
                key={child.id}
                onClick={() => onMenuClick(child)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all relative"
                style={{
                  backgroundColor: childIsActive
                    ? 'color-mix(in srgb, var(--t-accent-500) 14%, transparent)'
                    : 'transparent',
                  color: childIsActive ? 'var(--t-accent-600)' : 'var(--t-text-sub)',
                  fontWeight: childIsActive ? 600 : 500,
                }}
              >
                <span className="text-sm opacity-80">{child.icon || '•'}</span>
                <span className="flex-1 text-left truncate">{child.name}</span>
                {child.type === '目录' && child.children.some(gc => gc.type !== '按钮') && (
                  <span className="text-[9px]" style={{ color: 'var(--t-text-mute)' }}>›</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
