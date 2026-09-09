import { memo, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

const DATA_GRID_PANELS = ['References', 'History', 'Templates', 'Users']

const FALLBACK_SX = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
}

const loadedPanels = new Map()

const LazyPanel = ({ load }) => {
  const [Component, setComponent] = useState(() => loadedPanels.get(load) ?? null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (Component) return

    let cancelled = false
    load()
      .then(mod => {
        loadedPanels.set(load, mod.default)
        if (!cancelled) setComponent(() => mod.default)
      })
      .catch(error => {
        if (!cancelled) setLoadError(error)
      })
    return () => {
      cancelled = true
    }
  }, [Component, load])

  if (loadError) {
    throw loadError
  }

  if (!Component) {
    return (
      <Box sx={FALLBACK_SX}>
        <CircularProgress />
      </Box>
    )
  }

  return <Component />
}

const Panel = memo(({ load, name, isActive, hasBeenMounted }) => {
  const isDataGridPanel = DATA_GRID_PANELS.includes(name)

  const shouldRender = isActive || hasBeenMounted

  return (
    <Box
      id={`kb-panel-${name}`}
      sx={{
        display: isActive ? 'flex' : 'none',
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
      {shouldRender && <LazyPanel load={load} />}
    </Box>
  )
})

Panel.displayName = 'Panel'

export default Panel
