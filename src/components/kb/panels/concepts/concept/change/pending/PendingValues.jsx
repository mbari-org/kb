import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

const PendingValues = ({ disabled, leftMargin = 13.5, pendingValues }) => {
  return (
    <Box sx={{ ml: leftMargin }}>
      {pendingValues.map(([field, value]) => (
        <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
      ))}
    </Box>
  )
}

export default PendingValues
