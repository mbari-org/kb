import { Box } from "@mui/material"

const AlertButtonsContainer = ({ buttons }) => {
  return (
    <Box
      sx={{
        backgroundColor: "inherit",
        display: "flex",
        justifyContent: "space-between",
        mt: 4,
        padding: 1,
        width: "100%",
      }}
    >
      {buttons}
    </Box>
  )
}

export default AlertButtonsContainer
