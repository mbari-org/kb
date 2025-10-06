import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatField } from '@/components/common/format'

const ConfirmReferenceConcepts = ({ originalConcepts, updatedConcepts }) => {
  const original = originalConcepts || []
  const updated = updatedConcepts || []

  const hasChanged = JSON.stringify([...original].sort()) !== JSON.stringify([...updated].sort())

  if (!hasChanged) return null

  const added = updated.filter(v => !original.includes(v))
  const removed = original.filter(v => !updated.includes(v))

  const hasAdditions = added.length > 0
  const hasRemovals = removed.length > 0

  return (
    <Box sx={{ mt: 0.5 }}>
      <Typography sx={{ fontSize: '1.25rem' }}>{formatField('concepts')}</Typography>
      <Box sx={{ ml: 3 }}>
        {hasRemovals && (
          <FieldValueDisplay
            field='Removed'
            value={removed.join(', ')}
            sx={{ color: 'error.main' }}
          />
        )}
        {hasAdditions && (
          <FieldValueDisplay
            field='Added'
            value={added.join(', ')}
            sx={{ color: 'success.main' }}
          />
        )}
      </Box>
    </Box>
  )
}

export default ConfirmReferenceConcepts
