import { useEffect, useCallback } from 'react'
import panelMods from '@/components/kb/panels/modules'

/**
 * Hook to intelligently preload panels based on usage patterns
 */
const usePanelPreloader = (currentPanel, onPreload) => {
  // Preload panels on idle time
  const preloadOnIdle = useCallback(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload commonly accessed panels after current panel
        const commonPanels = ['Concepts', 'References', 'Templates']
        commonPanels.forEach(panelName => {
          if (panelName !== currentPanel) {
            onPreload(panelName)
          }
        })
      })
    }
  }, [currentPanel, onPreload])

  // Preload on hover (anticipatory loading)
  const preloadOnHover = useCallback(panelName => {
    const timeoutId = setTimeout(() => {
      onPreload(panelName)
    }, 100) // Small delay to avoid excessive preloading

    return () => clearTimeout(timeoutId)
  }, [onPreload])

  // Preload adjacent panels (likely to be accessed next)
  const preloadAdjacent = useCallback(() => {
    const currentIndex = panelMods.findIndex(p => p.name === currentPanel)
    if (currentIndex !== -1) {
      // Preload next and previous panels
      const nextPanel = panelMods[currentIndex + 1]
      const prevPanel = panelMods[currentIndex - 1]
      
      if (nextPanel) onPreload(nextPanel.name)
      if (prevPanel) onPreload(prevPanel.name)
    }
  }, [currentPanel, onPreload])

  useEffect(() => {
    // Start preloading after a short delay
    const timer = setTimeout(() => {
      preloadOnIdle()
      preloadAdjacent()
    }, 1000)

    return () => clearTimeout(timer)
  }, [preloadOnIdle, preloadAdjacent])

  return {
    preloadOnHover,
    preloadOnIdle,
    preloadAdjacent,
  }
}

export default usePanelPreloader
