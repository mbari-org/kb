import { useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { drop } from '@/lib/utils'

const StagedChildDetail = ({ stagedChild }) => {
  const { updates } = stagedChild

  const fieldValues = useMemo(() => {
    return Object.entries(drop(updates, ['name']))
  }, [updates])

  return (
    <Box>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedChildDetail
