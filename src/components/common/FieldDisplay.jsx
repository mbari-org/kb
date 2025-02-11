import { Box, Typography } from "@mui/material"

import { formatField } from "@/components/common/format"
const baseSx = {
  fontSize: "1.25rem",
  whiteSpace: "pre-wrap",
}
const fieldSx = {
  ...baseSx,
}

const valueSx = {
  ...baseSx,
  fontFamily: "monospace",
  fontWeight: 800,
}

const FieldDisplay = ({ field, value, sx }) => {
  return (
    <Box key={field} display="flex" flexDirection="row" sx={sx}>
      <Typography sx={fieldSx}>{formatField(field)}:</Typography>
      <Typography sx={valueSx} ml={1}>
        {typeof value === "boolean" ? String(value) : value}
      </Typography>
    </Box>
  )
}

export default FieldDisplay
