import { Box } from '@mui/material'

import Description from '@/components/common/Description'
import EditingDetails from '@/components/kb/panels/concepts/editingState/edits/EditingDetails'

const EditingStateContent = () => {
  return (
    <Box minWidth={500}>
      <Description description='You have the following unsaved changes:' sx={{ mb: 1 }} />
      <EditingDetails />
    </Box>
  )
}

export default EditingStateContent
