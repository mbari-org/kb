import { Box, Typography } from "@mui/material"

const baseSx = {
  fontSize: "1.25rem",
  whiteSpace: "pre-wrap",
}
const keySx = {
  ...baseSx,
}

const valueSx = {
  ...baseSx,
  fontFamily: "monospace",
  fontWeight: 800,
}

const EntryDetail = ({ field, value, sx }) => {
  return (
    <Box key={field} display="flex" flexDirection="row" sx={sx}>
      <Typography sx={keySx}>{field}:</Typography>
      <Typography sx={valueSx} ml={1}>
        {typeof value === "boolean" ? value.toString() : value}
      </Typography>
    </Box>
  )
}

export default EntryDetail
