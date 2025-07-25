import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { pick } from '@/lib/utils'

const Detail = ({ detail, keys, sx }) => {
  const displayDetail = keys ? pick(detail, keys) : detail

  const entries = keys
    ? keys.map(key => [key, displayDetail[key]]).filter(([, value]) => value !== undefined)
    : Object.entries(displayDetail)

  return (
    <Box>
      {entries.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} sx={sx} />
      ))}
    </Box>
  )
}

export default Detail
