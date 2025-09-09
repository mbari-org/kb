import { useEffect } from 'react'

const useTaxonomyTreeReposition = (apiRef, concept, expandedItems, containerRef) => {
  const conceptName = concept?.name

  useEffect(() => {
    if (!conceptName || !apiRef?.current) return

    const timer = setTimeout(() => {
      const el = apiRef.current.getItemDOMElement(conceptName)
      const container = containerRef?.current
      if (!el || !container) return

      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      const padding = 8
      const delta = eRect.top - cRect.top
      const targetScrollTop = Math.max(
        0,
        Math.min(
          container.scrollHeight - container.clientHeight,
          container.scrollTop + delta - padding
        )
      )

      container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
    }, 300)

    return () => clearTimeout(timer)
  }, [apiRef, conceptName, containerRef])
}

export default useTaxonomyTreeReposition
