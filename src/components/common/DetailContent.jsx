import { Box } from '@mui/material'

import FieldValueDisplay from './FieldValueDisplay'

const DetailContent = ({ detail, sx }) => {
  return (
    <Box>
      {Object.entries(detail).map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} sx={sx} />
      ))}
    </Box>
  )
}

export default DetailContent
