import { useMemo } from 'react'
import { Stack, Typography, Box } from '@mui/material'

import CONFIG from '@/lib/config'

const { FILTER } = CONFIG.PANELS.TEMPLATES.PANEL

const renderFilterRow = (label, value) => {
  const valueDisplay = value === FILTER.NONE ? <em>{FILTER.NO_SET}</em> : <strong>{value}</strong>

  return (
    <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
      <Typography sx={{ width: 120, flexShrink: 0, whiteSpace: 'nowrap' }}>
        <strong>{label}:</strong>
      </Typography>
      <Typography>{valueDisplay}</Typography>
    </Stack>
  )
}

const useFilterTooltip = filterTemplate => {
  return useMemo(() => {
    const concept = filterTemplate.concept || FILTER.NONE
    const linkName = filterTemplate.linkName || FILTER.NONE
    const toConcept = filterTemplate.toConcept || FILTER.NONE
    const linkValue = filterTemplate.linkValue || FILTER.NONE

    const titleProps = {
      mb: '0.5em !important',
      mt: '0.25em !important',
      textAlign: 'center',
    }

    return (
      <Stack direction='column' spacing={0}>
        <Typography sx={titleProps}>
          <strong>{FILTER.CURRENT}</strong>
        </Typography>
        <Box sx={{ minWidth: 400 }}>
          <Stack direction='column' spacing={1}>
            {renderFilterRow(FILTER.LABEL.CONCEPT, concept)}
            {renderFilterRow(FILTER.LABEL.LINK_NAME, linkName)}
            {renderFilterRow(FILTER.LABEL.TO_CONCEPT, toConcept)}
            {renderFilterRow(FILTER.LABEL.LINK_VALUE, linkValue)}
          </Stack>
        </Box>
      </Stack>
    )
  }, [filterTemplate])
}

export default useFilterTooltip
