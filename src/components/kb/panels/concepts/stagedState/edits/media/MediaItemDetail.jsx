import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const MediaItemDetail = ({ action, initial, updates }) => {
  let fieldValues

  switch (action) {
    case CONCEPT_STATE.MEDIA.ADD:
      fieldValues = ['credit', 'caption', 'isPrimary'].map(field => [
        field,
        field === 'isPrimary' ? (updates[field] === true ? 'true' : 'false') : updates[field],
      ])
      break
    case CONCEPT_STATE.MEDIA.DELETE:
      fieldValues = []
      break
    case CONCEPT_STATE.MEDIA.EDIT:
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

export default MediaItemDetail
