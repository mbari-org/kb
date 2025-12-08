import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { REALIZATION: REALIZATION } = CONCEPT_STATE

import { REALIZATION_DISPLAY_FIELDS } from '@/lib/kb/model/realization'
import { drop } from '@/lib/utils'

const StagedRealizationDetail = ({ initialRealization, stagedRealization }) => {
  const { action, updates } = stagedRealization

  const fieldValues = useMemo(() => {
    let fieldValues
    switch (action) {
      case REALIZATION.ADD:
        fieldValues = Object.entries(drop(updates, ['name']))
        break

      case REALIZATION.DELETE:
        // Show the values of the realization being deleted
        fieldValues = REALIZATION_DISPLAY_FIELDS.map(field => [field, initialRealization?.[field]])
        break

      case REALIZATION.EDIT:
        fieldValues = Object.entries(updates).map(([field, value]) => {
          if (initialRealization[field] !== value) {
            return [field, formatDelta(initialRealization[field], value)]
          }
        })
        break
    }
    return fieldValues
  }, [action, initialRealization, updates])

  return (
    <Box>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedRealizationDetail
