import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

const MediaItemDetail = ({ initialFields, stagedFields }) => {
  let fieldValues
  if (initialFields === null) {
    // Media Add
    fieldValues = stagedFields
  } else if (stagedFields === null) {
    // Media Delete
    fieldValues = initialFields
  } else {
    // Media Edit
    fieldValues = initialFields.reduce((acc, [field, initialValue], index) => {
      const stagedValue = stagedFields[index][1]
      if (initialValue !== stagedValue) {
        acc.push([field, formatDelta(initialValue, stagedValue)])
      }
      return acc
    }, [])
  }

  return (
    <Box sx={{ ml: 7 }}>
      {fieldValues.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default MediaItemDetail
