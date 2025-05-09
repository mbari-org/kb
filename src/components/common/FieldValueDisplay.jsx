import { Box, Typography } from '@mui/material'

import {
  fieldSx as baseFieldSx,
  formatField,
  valueSx as baseValueSx,
} from '@/components/common/format'

import { RESETTING } from '@/lib/constants'

const FieldValueDisplay = ({ field, resetting, sx, value }) => {
  const fieldSx =
    resetting === RESETTING.OTHER ? { ...baseFieldSx, color: 'text.disabled' } : baseFieldSx

  const valueSx =
    resetting === RESETTING.OTHER ? { ...baseValueSx, color: 'text.disabled' } : baseValueSx

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
