import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'portal:recent-visit'
const MAX_RECENT = 12

export interface RecentItem {
  id: number
  at: number
}

export function useRecentVisit() {
  const [recent, setRecent] = useState<RecentItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as RecentItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
  }, [recent])

  const record = useCallback((id: number) => {
    setRecent(prev => {
      const filtered = prev.filter(x => x.id !== id)
      return [{ id, at: Date.now() }, ...filtered].slice(0, MAX_RECENT)
    })
  }, [])

  const clear = useCallback(() => setRecent([]), [])

  const remove = useCallback((id: number) => {
    setRecent(prev => prev.filter(x => x.id !== id))
  }, [])

  const recentIds = recent.map(x => x.id)

  return { recentIds, record, clear, remove }
}
