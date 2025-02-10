import { Box } from "@mui/material"

import FieldDisplay from "./FieldDisplay"
import ResetField from "./ResetField"

const FieldDetail = ({ edit }) => {
  const [field, _] = edit
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ResetField field={field} />
      <FieldDisplay edit={edit} />
    </Box>
  )
}

export default FieldDetail
