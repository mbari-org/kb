import { Box } from "@mui/material"

const DotIcon = ({ bgcolor }) => {
  return (
    <Box
      sx={{
        bgcolor,
        borderRadius: "70%",
        display: "inline-block",
        height: 6,
        mx: 0.5,
        width: 6,
        zIndex: 1,
      }}
    />
  )
}

export default DotIcon
