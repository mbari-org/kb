import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import panelMods from '@/components/kb/panels/modules'
import Panel from '@/components/kb/panels/Panel'
import {
  PanelsModalProvider,
  usePanelsModalOperationsContext,
} from '@/contexts/panels/PanelModalProvider'

import SelectedContext from '@/contexts/selected/SelectedContext'

const PanelsModalMount = () => {
  const { modal, processing } = usePanelsModalOperationsContext()
  return !processing && modal && typeof modal === 'function' ? modal() : null
}

const Panels = () => {
  const { panels } = use(SelectedContext)
  const activePanel = panels.current()

  const [mountedPanels, setMountedPanels] = useState(new Set([activePanel]))

  useEffect(() => {
    setMountedPanels(prev => new Set([...prev, activePanel]))
  }, [activePanel])

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <PanelsModalProvider>
        {panelMods.map(({ module: PanelComponent, name }) => (
          <Panel
            key={name}
            hasBeenMounted={mountedPanels.has(name)}
            isActive={activePanel === name}
            panelComponent={PanelComponent}
            name={name}
          />
        ))}
        <PanelsModalMount />
      </PanelsModalProvider>
    </Box>
  )
}

export default Panels
