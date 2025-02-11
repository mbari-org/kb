import { Box } from "@mui/material"

import FieldDisplay from "@/components/common/FieldDisplay"
import FieldReset from "./FieldReset"

import { formatDelta } from "@/components/common/format"
const FieldDetail = ({ edit }) => {
  const [field, { initial, pending }] = edit
  const value = formatDelta(field, initial, pending)
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FieldReset field={field} />
      <FieldDisplay field={field} value={value} />
    </Box>
  )
}

export default FieldDetail
