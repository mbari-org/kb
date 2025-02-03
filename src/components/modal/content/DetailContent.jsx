import { Box, Typography } from "@mui/material"

const DetailContent = ({ detail, sx }) => {
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

  return (
    <>
      {Object.entries(detail).map(([key, value]) => (
        <Box key={key} display="flex" flexDirection="row" sx={sx}>
          <Typography sx={keySx}>{key}:</Typography>
          <Typography sx={valueSx} ml={1}>
            {typeof value === "boolean" ? value.toString() : value}
          </Typography>
        </Box>
      ))}
    </>
  )
}

export default DetailContent
