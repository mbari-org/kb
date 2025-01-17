import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createAlertContentText } from "../components"

import { prettyPrintObject } from "@/lib/kb/util"

const AlertContentUnsavedEdits = ({ updates }) => {
  const theme = useTheme()

  const AlertContentText = createAlertContentText({
    sx: { mt: 2, mb: 2 },
    text: "You have the following unsaved edits:",
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
          mb: 8,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >
        {prettyPrintObject(updates)}
      </Typography>
    </>
  )
}

export default AlertContentUnsavedEdits
