import { Box, Typography } from "@mui/material"

import { fieldSx, formatField, valueSx } from "@/components/common/format"

const FieldValueDisplay = ({ field, value, sx }) => {
  return (
    <Box key={field} display="flex" flexDirection="row" sx={sx}>
      <Typography sx={fieldSx}>{formatField(field)}:</Typography>
      <Typography sx={valueSx} ml={1}>
        {typeof value === "boolean" ? String(value) : value}
      </Typography>
    </Box>
  )
}

export default FieldValueDisplay
