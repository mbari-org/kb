import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import panelMods from '@/components/kb/panels/modules'
import Panel from '@/components/kb/panels/Panel'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { SELECTED } from '@/lib/constants/selected.js'

const Panels = () => {
  const { panels } = use(SelectedContext)
  const { setMediaSuspended } = use(TaxonomyContext)
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

  useEffect(() => {
    setMediaSuspended(activePanel !== SELECTED.PANELS.CONCEPTS)
  }, [activePanel, setMediaSuspended])

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'clip' }}>
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
