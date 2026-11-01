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

  const scrollToNode = useCallback(
    (onComplete, delayMs = 0) => {
      let cancelled = false

      const complete = () => {
        if (cancelled) return
        onComplete?.()
      }

      const run = () => {
        if (cancelled) return

        if (!needsToScroll()) {
          complete()
          return
        }

        setTimeout(() => {
          if (cancelled) return

          if (!conceptName || !apiRef?.current) {
            complete()
            return
          }

          const el = apiRef.current.getItemDOMElement(conceptName)
          const container = containerRef?.current
          if (!el || !container) {
            complete()
            return
          }

          let done = false
          const finish = () => {
            if (done || cancelled) return
            done = true
            container.removeEventListener?.('scrollend', finish)
            setTimeout(complete, 100)
          }

          container.addEventListener?.('scrollend', finish, { once: true })
          const fallback = setTimeout(finish, 700)

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

          // Keep fallback if scrollend never fires
          container.addEventListener?.(
            'scrollend',
            () => clearTimeout(fallback),
            { once: true }
          )
        }, 100)
      }

      if (delayMs && delayMs > 0) {
        const timeoutId = setTimeout(run, delayMs)
        return () => {
          cancelled = true
          clearTimeout(timeoutId)
        }
      }

      run()
      return () => {
        cancelled = true
      }
    },
    [apiRef, conceptName, containerRef, needsToScroll]
  )

  return { needsToScroll, scrollToNode }
}

export default useConceptsTreeScroll
