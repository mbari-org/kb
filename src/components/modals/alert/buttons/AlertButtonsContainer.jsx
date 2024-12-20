import { Box } from "@mui/material"

const AlertButtonsContainer = ({ buttons }) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        height: "100%",
        mt: 2,
        position: "relative",
        px: 0,
      }}
    >
      {buttons}
    </Box>
  )
}

export default AlertButtonsContainer
