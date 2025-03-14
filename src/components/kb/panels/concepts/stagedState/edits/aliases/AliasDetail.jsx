import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { drop } from '@/lib/util'

const AliasDetail = ({ action, initial, updates }) => {
  let fieldValues
  switch (action) {
    case CONCEPT_STATE.ALIAS.ADD:
      fieldValues = Object.entries(drop(updates, ['name']))
      break
    case CONCEPT_STATE.ALIAS.DELETE:
      fieldValues = []
      break
    case CONCEPT_STATE.ALIAS.EDIT:
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
