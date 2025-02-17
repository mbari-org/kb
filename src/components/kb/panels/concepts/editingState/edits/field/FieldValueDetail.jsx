import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import FieldReset from './FieldReset'

const FieldValueDetail = ({ field, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FieldReset field={field} />
      <FieldValueDisplay field={field} value={value} />
    </Box>
  )
}

export default FieldValueDetail
