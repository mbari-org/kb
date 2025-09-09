import { useCallback } from 'react'

const useConceptsTreeScroll = (apiRef, concept, containerRef) => {
  const conceptName = concept?.name

  const needsToScroll = useCallback(() => {
    if (!conceptName || !apiRef?.current) return false

    const node = apiRef.current.getItemDOMElement(conceptName)
    if (!node) return false

    const container = containerRef?.current
    if (!container) return false

    const cRect = container.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()

    return nodeRect.top < cRect.top || nodeRect.bottom > cRect.bottom
  }, [conceptName, apiRef, containerRef])

  const scrollToNode = useCallback(onComplete => {
    setTimeout(() => {
      if (!conceptName || !apiRef?.current) return

      const el = apiRef.current.getItemDOMElement(conceptName)
      const container = containerRef?.current
      if (!el || !container) return

      let done = false
      const finish = () => {
        if (done) return
        done = true
        container.removeEventListener?.('scrollend', finish)
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 500)
      }

      container.addEventListener?.('scrollend', finish, { once: true })

      const fallback = setTimeout(finish, 700)
      container.addEventListener?.('scrollend', () => clearTimeout(fallback), { once: true })

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
    }, 500)
  }, [apiRef, conceptName, containerRef])

  return { needsToScroll, scrollToNode }
}

export default useConceptsTreeScroll
