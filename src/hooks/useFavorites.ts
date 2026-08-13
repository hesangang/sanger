import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'portal:favorites'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as number[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds])

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const addFavorite = useCallback((id: number) => {
    setFavoriteIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeFavorite = useCallback((id: number) => {
    setFavoriteIds(prev => prev.filter(x => x !== id))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavoriteIds([])
  }, [])

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  }
}
