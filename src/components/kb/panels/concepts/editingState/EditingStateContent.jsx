import { Box } from '@mui/material'

import Description from '@/components/common/Description'
import EditDetails from '@/components/kb/panels/concepts/editingState/edits/EditDetails'

const EditingStateContent = () => {
  return (
    <Box minWidth={500}>
      <Description description='You have the following unsaved changes:' sx={{ mb: 1 }} />
      <EditDetails />
    </Box>
  )
}

export default EditingStateContent
