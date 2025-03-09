import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

const AliasDetail = ({ initialFields, stagedFields }) => {
  let fieldValues
  if (initialFields === null) {
    // Alias Add
    fieldValues = stagedFields
  } else if (stagedFields === null) {
    // Alias Delete
    fieldValues = initialFields
  } else {
    // Alias Edit
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

export default AliasDetail
