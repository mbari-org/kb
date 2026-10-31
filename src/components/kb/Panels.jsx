import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import panelMods from '@/components/kb/panels/modules'
import Panel from '@/components/kb/panels/Panel'

import SelectedContext from '@/contexts/selected/SelectedContext'

const Panels = () => {
  const { panels } = use(SelectedContext)
  const activePanel = panels.current()

  const [mountedPanels, setMountedPanels] = useState(() => new Set([activePanel]))

  const hasPanel = mountedPanels.has(activePanel)
  useEffect(() => {
    if (!hasPanel) {
      const timeoutId = setTimeout(() => {
        setMountedPanels(prev => new Set([...prev, activePanel]))
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [activePanel, hasPanel])

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      {panelMods.map(({ load, name }) => (
        <Panel
          key={name}
          hasBeenMounted={mountedPanels.has(name)}
          isActive={activePanel === name}
          load={load}
          name={name}
        />
      ))}
    </Box>
  )
}

export default Panels
