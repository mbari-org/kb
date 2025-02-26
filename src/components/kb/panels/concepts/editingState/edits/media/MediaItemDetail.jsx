import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

const MediaItemDetail = ({ initialFields, editingFields }) => {
  let fieldValues
  if (initialFields === null) {
    // Media Add
    fieldValues = editingFields
  } else if (editingFields === null) {
    // Media Delete
    fieldValues = initialFields
  } else {
    // Media Edit
    fieldValues = initialFields.reduce((acc, [field, initialValue], index) => {
      const editingValue = editingFields[index][1]
      if (initialValue !== editingValue) {
        acc.push([field, formatDelta(initialValue, editingValue)])
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
