import { useState } from 'react'

import panelStore from '@/lib/store/panels'

const useSelectedPanel = () => {
  const [currentPanel, setCurrentPanel] = useState(panelStore.current())

  return {
    ...panelStore,

    back: () => {
      const result = panelStore.back()
      setCurrentPanel(panelStore.current())
      return result
    },

    current: () => currentPanel,

    forward: () => {
      const result = panelStore.forward()
      setCurrentPanel(panelStore.current())
      return result
    },

    push: name => {
      panelStore.push(name)
      setCurrentPanel(name)
    },
  }
}

export default useSelectedPanel
