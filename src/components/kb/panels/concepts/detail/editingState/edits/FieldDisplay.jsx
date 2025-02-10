import { Box, Typography } from "@mui/material"

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

const formatField = field => {
  return field
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim() // Remove any leading/trailing spaces
}

const FieldDisplay = ({ edit, sx }) => {
  const [field, { initial, pending }] = edit
  return (
    <Box key={field} display="flex" flexDirection="row" sx={sx}>
      <Typography sx={fieldSx}>{formatField(field)}:</Typography>
      <Typography sx={deltaSx} ml={1}>
        {formatDelta(field, initial, pending)}
      </Typography>
    </Box>
  )
}

export default FieldDisplay
