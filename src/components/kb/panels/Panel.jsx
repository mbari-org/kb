import { memo } from 'react'
import { Box } from '@mui/material'

const DATA_GRID_PANELS = ['References', 'History', 'Templates', 'Users']

const Panel = memo(({ panelComponent, name, isActive, hasBeenMounted }) => {
  const isDataGridPanel = DATA_GRID_PANELS.includes(name)

  const shouldRender = isActive || hasBeenMounted

  return (
    <Box
      id={`kb-panel-${name}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        left: 0,
        minHeight: isDataGridPanel ? '400px' : 'auto',
        overflow: 'hidden',
        pointerEvents: isActive ? 'auto' : 'none',
        position: isActive ? 'relative' : 'absolute',
        top: 0,
        visibility: isActive ? 'visible' : 'hidden',
        width: '100%',
      }}
    >
      {shouldRender && panelComponent()}
    </Box>
  )
})

Panel.displayName = 'Panel'

export default Panel
