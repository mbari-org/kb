import { useCallback } from 'react'

// The concept's node mounts only after its ancestry path expands, and expand/collapse
//  transitions keep shifting layout for a few hundred ms; poll (bounded) until the
//  element exists and its position has settled before measuring for the scroll.
const POLL_INTERVAL_MS = 100
const MAX_POLLS = 80

const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown']

const useConceptsTreeScroll = (apiRef, concept, containerRef) => {
  const conceptName = concept?.name

  const scrollToNode = useCallback(
    (onComplete, delayMs = 0) => {
      let cancelled = false
      let timeoutId
      let lastTop = null
      let watchedContainer = null

      const cancel = () => {
        cancelled = true
        clearTimeout(timeoutId)
        if (watchedContainer) {
          USER_SCROLL_EVENTS.forEach(type => watchedContainer.removeEventListener(type, cancelOnUserScroll))
          watchedContainer = null
        }
      }

      const cancelOnUserScroll = () => cancel()

      const watchUserScroll = container => {
        if (watchedContainer || !container) return
        watchedContainer = container
        USER_SCROLL_EVENTS.forEach(type => container.addEventListener(type, cancelOnUserScroll, { passive: true }))
      }

      const complete = () => {
        if (cancelled) return
        cancel()
        onComplete?.()
      }

      const schedule = (fn, interval = POLL_INTERVAL_MS) => {
        timeoutId = setTimeout(() => {
          if (!cancelled) fn()
        }, interval)
      }

      const poll = pollsLeft => {
        if (cancelled) return
        if (pollsLeft <= 0) {
          complete()
          return
        }

        const container = containerRef?.current
        const element = conceptName && apiRef?.current ? apiRef.current.getItemDOMElement(conceptName) : null
        if (!element || !container) {
          lastTop = null
          schedule(() => poll(pollsLeft - 1))
          return
        }

        watchUserScroll(container)

        const eRect = element.getBoundingClientRect()
        if (lastTop === null || lastTop !== eRect.top) {
          lastTop = eRect.top
          schedule(() => poll(pollsLeft - 1))
          return
        }

        const cRect = container.getBoundingClientRect()
        if (eRect.top >= cRect.top && eRect.bottom <= cRect.bottom) {
          complete()
          return
        }

        const padding = 8
        const targetScrollTop = Math.max(
          0,
          Math.min(
            container.scrollHeight - container.clientHeight,
            container.scrollTop + (eRect.top - cRect.top) - padding
          )
        )

        let done = false
        const finish = () => {
          if (done || cancelled) return
          done = true
          container.removeEventListener?.('scrollend', finish)
          // Re-verify after the smooth scroll; layout may have kept moving.
          lastTop = null
          schedule(() => poll(pollsLeft - 1))
        }

        container.addEventListener?.('scrollend', finish, { once: true })
        const fallback = setTimeout(finish, 700)

        container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })

        // Keep fallback if scrollend never fires
        container.addEventListener?.(
          'scrollend',
          () => clearTimeout(fallback),
          { once: true }
        )
      }

      const run = () => poll(MAX_POLLS)

      if (delayMs && delayMs > 0) {
        schedule(run, delayMs)
      } else {
        run()
      }

      return cancel
    },
    [apiRef, conceptName, containerRef]
  )

  return { scrollToNode }
}

export default useConceptsTreeScroll
