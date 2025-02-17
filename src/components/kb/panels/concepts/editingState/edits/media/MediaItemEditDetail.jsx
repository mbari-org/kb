import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

const MediaItemEditDetail = ({ initialFields, pendingFields }) => {
  let fieldValues
  if (initialFields === null) {
    // Media Add
    fieldValues = pendingFields
  } else if (pendingFields === null) {
    // Media Delete
    fieldValues = initialFields
  } else {
    // Media Edit
    fieldValues = initialFields.reduce((acc, [field, initialValue], index) => {
      const pendingValue = pendingFields[index][1]
      if (initialValue !== pendingValue) {
        acc.push([field, formatDelta(initialValue, pendingValue)])
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

export default MediaItemEditDetail
