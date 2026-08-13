import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'portal:collapsed-regions'

export function useCollapsedRegions() {
  const [collapsed, setCollapsed] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
  }, [collapsed])

  const isCollapsed = useCallback((id: string) => collapsed.includes(id), [collapsed])

  const toggle = useCallback((id: string) => {
    setCollapsed(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const expandAll = useCallback(() => setCollapsed([]), [])
  const collapseAll = useCallback((ids: string[]) => setCollapsed(ids), [])

  return { collapsed, isCollapsed, toggle, expandAll, collapseAll }
}
