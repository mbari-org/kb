import { memo, useState, useEffect } from 'react'
import { Box } from '@mui/material'

import panelMods from '@/components/kb/panels/modules'

// List of panel names that contain DataGrid components
const DATA_GRID_PANELS = ['References', 'History', 'Templates', 'Users']

const Panel = memo(({ PanelComponent, name, isActive, hasBeenMounted }) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  // Check if this is a DataGrid panel
  const isDataGridPanel = DATA_GRID_PANELS.includes(name)

  // Track when this panel has been visible (active) at least once
  useEffect(() => {
    if (isActive && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [isActive, hasBeenVisible])

  // Determine if panel should render based on panel type and mount/visibility state
  let shouldRender
  if (isDataGridPanel) {
    // DataGrid panels: render when active (allowing initial mount to set hasBeenVisible)
    // but ensure container has proper flex layout to prevent zero-height
    shouldRender = isActive
  } else {
    // Non-DataGrid panels: render if currently active OR has been mounted before
    shouldRender = isActive || hasBeenMounted
  }

  return (
    <Box
      id={`kb-panel-${name}`}
      sx={{
        display: isActive ? 'flex' : 'none',
        flexDirection: 'column',
        height: '100%',
        minHeight: isDataGridPanel ? '400px' : 'auto',
        overflow: 'hidden',
      }}
    >
      {shouldRender && <PanelComponent />}
    </Box>
  )
})

Panel.displayName = 'Panel'

const PanelWrapper = memo(({ activePanel }) => {
  const [mountedPanels, setMountedPanels] = useState(new Set([activePanel]))

  useEffect(() => {
    setMountedPanels(prev => new Set([...prev, activePanel]))
  }, [activePanel])

  return (
    <>
      {panelMods.map(({ module: PanelComponent, name }) => (
        <Panel
          key={name}
          PanelComponent={PanelComponent}
          name={name}
          isActive={activePanel === name}
          hasBeenMounted={mountedPanels.has(name)}
        />
      ))}
    </>
  )
})

PanelWrapper.displayName = 'PanelWrapper'

export default PanelWrapper
