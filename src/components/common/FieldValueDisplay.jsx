import { Box, Typography } from '@mui/material'

import {
  fieldSx as baseFieldSx,
  formatField,
  valueSx as baseValueSx,
} from '@/components/common/format'

const FieldValueDisplay = ({ disabled, field, sx, value }) => {
  const fieldSx = disabled ? { ...baseFieldSx, color: 'text.disabled' } : baseFieldSx
  const valueSx = disabled ? { ...baseValueSx, color: 'text.disabled' } : baseValueSx

  return (
    <Box key={field} display='flex' flexDirection='row' sx={sx}>
      <Typography sx={fieldSx}>{formatField(field)}:</Typography>
      <Typography sx={valueSx} ml={1}>
        {typeof value === 'boolean' ? String(value) : value}
      </Typography>
    </Box>
  )
}

export default FieldValueDisplay
