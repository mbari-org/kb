import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'

const { TEMPLATE } = CONCEPT_STATE

const StagedTemplateDetail = ({ initialTemplate, stagedTemplate }) => {
  const { action, updates } = stagedTemplate

  const fieldValues = useMemo(() => {
    switch (action) {
      case TEMPLATE.ADD:
        return Object.entries(updates)

      case TEMPLATE.DELETE:
        return REALIZATION_VALUE_FIELDS.map(field => [field, initialTemplate[field]])

      case TEMPLATE.EDIT:
        return Object.entries(updates).map(([field, value]) => [field, formatDelta(initialTemplate[field], value)])

      default:
        return []
    }
  }, [action, initialTemplate, updates])

  return (
    <Box>
      {fieldValues.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedTemplateDetail
