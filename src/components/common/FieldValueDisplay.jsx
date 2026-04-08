import { Box, Typography } from '@mui/material'

import {
  fieldSx as baseFieldSx,
  formatField,
  valueSx as baseValueSx,
} from '@/components/common/format'

const FieldValueDisplay = ({ disabled, field, sx, value }) => {
  const fieldSx = disabled ? { ...baseFieldSx, color: 'text.disabled' } : baseFieldSx
  const valueSx = disabled ? { ...baseValueSx, color: 'text.disabled' } : baseValueSx
  const containerSx = { display: 'flex', flexDirection: 'row', ...sx }

  return (
    <Box key={field} sx={containerSx}>
      <Typography sx={fieldSx}>{formatField(field)}:</Typography>
      <Typography sx={{ ...valueSx, ml: 1 }}>
        {typeof value === 'boolean' ? String(value) : value}
      </Typography>
    </Box>
  )
}

export default FieldValueDisplay
