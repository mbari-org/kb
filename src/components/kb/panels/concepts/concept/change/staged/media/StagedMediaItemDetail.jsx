import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { MEDIA_ITEM: MEDIA_ITEM } = CONCEPT_STATE

const StagedMediaItemDetail = ({ initialMediaItem, stagedMediaItem }) => {
  const { action, updates } = stagedMediaItem

  const fieldValues = useMemo(() => {
    let fieldValues
    switch (action) {
      case MEDIA_ITEM.ADD:
        fieldValues = ['credit', 'caption', 'isPrimary'].map(field => [
          field,
          field === 'isPrimary' ? (updates[field] === true ? 'true' : 'false') : updates[field],
        ])
        break

      case MEDIA_ITEM.DELETE:
        fieldValues = []
        break

      case MEDIA_ITEM.EDIT:
        fieldValues = Object.entries(updates).map(([field, value]) => {
          if (initialMediaItem[field] !== value) {
            return [field, formatDelta(initialMediaItem[field], value)]
          }
        })
        break
    }
    return fieldValues
  }, [action, initialMediaItem, updates])

  return (
    <Box>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedMediaItemDetail
