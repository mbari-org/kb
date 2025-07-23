import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/constants'

const { REALIZATION: REALIZATION } = CONCEPT_STATE

import { drop } from '@/lib/utils'

const StagedRealization = ({ initialRealization, stagedRealization }) => {
  const { action, updates } = stagedRealization

  const fieldValues = useMemo(() => {
    let fieldValues
    switch (action) {
      case REALIZATION.ADD:
        fieldValues = Object.entries(drop(updates, ['name']))
        break

      case REALIZATION.DELETE:
        fieldValues = []
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

export default StagedRealization
