import { Box, Typography } from "@mui/material"

import { formatField } from "./editingState"

const baseSx = {
  fontSize: "1.25rem",
  whiteSpace: "pre-wrap",
}
const fieldSx = {
  ...baseSx,
}

const deltaSx = {
  ...baseSx,
  fontFamily: "monospace",
  fontWeight: 800,
}

const stringDisplay = field => (field !== "" ? field : '""')

const formatDelta = (field, initial, pending) => {
  if (field === "nameUpdate") {
    return pending
  }
  return `${stringDisplay(initial)} --> ${stringDisplay(pending)}`
}

const FieldDisplay = ({ edit, sx }) => {
  const [field, { initial, pending }] = edit
  const delta = formatDelta(field, initial, pending)
  return (
    <Box key={field} display="flex" flexDirection="row" sx={sx}>
      <Typography sx={fieldSx}>{field}:</Typography>
      <Typography sx={deltaSx} ml={1}>
        {delta}
      </Typography>
    </Box>
  )
}

export default FieldDisplay
