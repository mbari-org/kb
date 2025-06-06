import { useState } from 'react'

import { createPanelStore } from '@/lib/store/panelStore'

import panelMods from '@/components/kb/panels/modules'

const usePanelSelect = () => {
  const defaultPanel = panelMods[0].name

  const panelStore = createPanelStore(defaultPanel)

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

export default usePanelSelect
