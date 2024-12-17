import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createAlertTextMessage } from "./components"

const prettyPrintUpdates = updates => {
  return Object.entries(updates)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
}

const AlertUnsavedEditsMessage = ({ updates }) => {
  const theme = useTheme()

  const AlertTextMessage = createAlertTextMessage({
    text: "You have the following unsaved edits:",
    type: "warning",
  })

  return (
    <>
      <AlertTextMessage />
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

export default AlertUnsavedEditsMessage
