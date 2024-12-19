import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createTextAlertMessage } from "./components"

const prettyPrintUpdates = updates => {
  return Object.entries(updates)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
}

const AlertContentUnsavedEdits = ({ updates }) => {
  const theme = useTheme()

  const AlertContentText = createTextAlertMessage({
    text: "You have the following unsaved edits:",
    type: "warning",
  })

  return (
    <>
      <AlertContentText />
      <Typography
        id="modal-error-detail"
        variant="h6"
        component="h3"
        sx={{
          color: theme.palette.common.black,
          mt: 1,
          ml: 2,
          mb: 5,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >
        {prettyPrintUpdates(updates)}
      </Typography>
    </>
  )
}

export default AlertContentUnsavedEdits
