import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { ALIAS } = CONCEPT_STATE

import { drop } from '@/lib/util'

const AliasDetail = ({ action, initial, resetting, updates }) => {
  const fieldValues = useMemo(() => {
    let fieldValues
    switch (action) {
      case ALIAS.ADD:
        fieldValues = Object.entries(drop(updates, ['name']))
        break

      case ALIAS.DELETE:
        fieldValues = []
        break

      case ALIAS.EDIT:
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
        <FieldValueDisplay key={field} field={field} changing={resetting} value={value} />
      ))}
    </Box>
  )
}

export default AliasDetail
