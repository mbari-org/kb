import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

const { FILTER } = CONFIG.PANELS.TEMPLATES.PANEL

const useFilterDisplay = filterTemplate => {
  return useMemo(() => {
    const concept = filterTemplate?.concept || FILTER.DEFAULT.CONCEPT
    const linkName = filterTemplate?.linkName || FILTER.DEFAULT.LINK_NAME
    const toConcept = filterTemplate?.toConcept || FILTER.DEFAULT.TO_CONCEPT
    const linkValue = filterTemplate?.linkValue || FILTER.DEFAULT.LINK_VALUE

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
            <strong>Current filter</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{FILTER.LABEL.CONCEPT}:</strong>
          </Typography>
          <Typography variant='body2'>{concept}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{FILTER.LABEL.LINK_NAME}:</strong>
          </Typography>
          <Typography variant='body2'>{linkName}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{FILTER.LABEL.TO_CONCEPT}:</strong>
          </Typography>
          <Typography variant='body2'>{toConcept}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{FILTER.LABEL.LINK_VALUE}:</strong>
          </Typography>
          <Typography variant='body2'>{linkValue}</Typography>
        </Box>
      </Box>
    )
  }, [filterTemplate])
}

export default useFilterDisplay
