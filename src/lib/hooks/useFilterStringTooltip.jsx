import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'

import { CONFIG } from '@/config/js/index.js'

/**
 * Hook that returns a tooltip component with structured filter information
 * @param {Object} filterTemplate - The filter template object with concept, linkName, toConcept, linkValue
 * @returns {JSX.Element} A Box component containing filter details for use in tooltips
 */
const useFilterStringTooltip = filterTemplate => {
  return useMemo(() => {
    const concept = filterTemplate?.concept || '*'
    const linkName = filterTemplate?.linkName || '*'
    const toConcept = filterTemplate?.toConcept || '*'
    const linkValue = filterTemplate?.linkValue || '*'

    return (
      <Box
        sx={{
          minWidth: 300,
          p: 1.5,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Typography variant='body2'>
            <strong>{CONFIG.PANELS.TEMPLATES.TOOLTIP.FILTER}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Concept:</strong>
          </Typography>
          <Typography variant='body2'>{concept}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Link name:</strong>
          </Typography>
          <Typography variant='body2'>{linkName}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>To concept:</strong>
          </Typography>
          <Typography variant='body2'>{toConcept}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Link value:</strong>
          </Typography>
          <Typography variant='body2'>{linkValue}</Typography>
        </Box>
      </Box>
    )
  }, [filterTemplate])
}

export default useFilterStringTooltip
