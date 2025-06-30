import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

const Detail = ({ detail, sx }) => {
  return (
    <Box>
      {Object.entries(detail).map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} sx={sx} />
      ))}
    </Box>
  )
}

export default Detail
