import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

const ConfirmReferenceField = ({ field, originalValue, updatedValue }) => {
  if (originalValue == updatedValue) return null

  return (
    <Box sx={{ mt: 0.5 }}>
      <FieldValueDisplay field={field} value={updatedValue} />
    </Box>
  )
}

export default ConfirmReferenceField
