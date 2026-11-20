import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { FIELDS } from '@/lib/config/fields.js'

const { CAPTION, CREDIT, IS_PRIMARY } = FIELDS.MEDIA

const MediaItemDetail = ({ action, disabled, initial, updates }) => {
  let fieldValues

  switch (action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD:
      fieldValues = [CREDIT, CAPTION, IS_PRIMARY].map(field => [
        field,
        field === IS_PRIMARY ? (updates[field] === true ? 'true' : 'false') : updates[field],
      ])
      break

    case CONCEPT_STATE.MEDIA_ITEM.DELETE:
      fieldValues = []
      break

    case CONCEPT_STATE.MEDIA_ITEM.EDIT:
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
        <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
      ))}
    </Box>
  )
}

export default MediaItemDetail
