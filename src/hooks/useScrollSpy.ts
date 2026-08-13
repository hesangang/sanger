import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: string[], offset = 80) {
  const [activeId, setActiveId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (sectionIds.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY + offset
      let current: string | undefined = undefined
      for (const id of sectionIds) {
        const el = document.getElementById(`region-${id}`)
        if (!el) continue
        if (el.offsetTop <= scrollY) current = id
      }
      if (current && current !== activeId) setActiveId(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [sectionIds, offset, activeId])

  return [activeId, setActiveId] as const
}
