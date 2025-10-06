import { Box, Tooltip } from '@mui/material'

import { capitalize } from '@/lib/utils'

const TemplateCell = ({ filterKey, updateFilters }) => {
  const Cell = params => {
    const value = params.value
    if (!value) return null
    return (
      <Tooltip title={`Set filter ${filterKey}`} placement='top' enterDelay={500}>
        <Box
          component='span'
          onClick={() => updateFilters({ [filterKey]: value })}
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {value}
        </Box>
      </Tooltip>
    )
  }
  Cell.displayName = `${capitalize(filterKey)}TemplateCell`
  return Cell
}

export default TemplateCell
