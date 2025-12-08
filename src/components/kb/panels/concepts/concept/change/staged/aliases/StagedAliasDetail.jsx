import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { ALIAS: ALIAS } = CONCEPT_STATE

import { drop } from '@/lib/utils'

const StagedAliasDetail = ({ initialAlias, stagedAlias }) => {
  const { action, updates } = stagedAlias

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
          if (initialAlias[field] !== value) {
            return [field, formatDelta(initialAlias[field], value)]
          }
        })
        break
    }
    return fieldValues
  }, [action, initialAlias, updates])

  return (
    <Box>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedAliasDetail
