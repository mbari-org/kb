import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const {
  ALIAS: { ADD, DELETE, EDIT },
} = CONCEPT_STATE

import { drop } from '@/lib/util'

const AliasDetail = ({ action, initial, updates }) => {
  let fieldValues
  switch (action) {
    case ADD:
      fieldValues = Object.entries(drop(updates, ['name']))
      break

    case DELETE:
      fieldValues = []
      break

    case EDIT:
      fieldValues = Object.entries(updates).map(([field, value]) => {
        if (initial[field] !== value) {
          return [field, formatDelta(initial[field], value)]
        }
      })
      break
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
