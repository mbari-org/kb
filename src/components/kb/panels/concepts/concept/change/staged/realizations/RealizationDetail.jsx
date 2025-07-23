import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/constants'

const { REALIZATION: REALIZATION } = CONCEPT_STATE

import { drop } from '@/lib/utils'

const RealizationDetail = ({ action, disabled, initial, updates }) => {
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
          if (initial[field] !== value) {
            return [field, formatDelta(initial[field], value)]
          }
        })
        break
    }
    return fieldValues
  }, [action, initial, updates])

  return (
    <Box sx={{ ml: 7 }}>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
      ))}
    </Box>
  )
}

export default RealizationDetail
