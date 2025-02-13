import { Box } from "@mui/material"

import FieldValueDisplay from "@/components/common/FieldValueDisplay"
import FieldReset from "./FieldReset"

import { formatField } from "@/components/common/format"

const FieldValueDetail = ({ field, value }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FieldReset field={formatField(field)} />
      <FieldValueDisplay field={field} value={value} />
    </Box>
  )
}

export default FieldValueDetail
