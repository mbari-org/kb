import { Box } from "@mui/material"

import Description from "@/components/common/Description"
import EditsDetail from "@/components/kb/panels/concepts/editingState/edits/EditsDetail"

const EditingStateContent = () => {
  return (
    <Box minWidth={500}>
      <Description
        description="You have the following unsaved changes:"
        sx={{ mb: 1 }}
      />
      <EditsDetail />
    </Box>
  )
}

export default EditingStateContent
