import { Box, Stack, Typography } from '@mui/material'

const ReferenceChanges = ({ label, oldValue, newValue, isArray = false }) => {
  const hasChanged = isArray
    ? JSON.stringify(oldValue?.sort()) !== JSON.stringify(newValue?.sort())
    : oldValue !== newValue

  if (!hasChanged) return null

  const formatValue = value => {
    if (isArray) {
      return value && value.length > 0 ? value.join(', ') : 'None'
    }
    return value || 'None'
  }

  const getArrayDiff = () => {
    if (!isArray) return null
    const old = oldValue || []
    const updated = newValue || []
    const added = updated.filter(v => !old.includes(v))
    const removed = old.filter(v => !updated.includes(v))
    return { added, removed }
  }

  const diff = isArray ? getArrayDiff() : null

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {!isArray ? (
        <Stack spacing={1}>
          <Box sx={{ pl: 2 }}>
            <Typography variant='body2' color='error.main' sx={{ textDecoration: 'line-through' }}>
              {formatValue(oldValue)}
            </Typography>
          </Box>
          <Box sx={{ pl: 2 }}>
            <Typography variant='body2' color='success.main'>
              {formatValue(newValue)}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={1}>
          {diff.removed.length > 0 && (
            <Box sx={{ pl: 2 }}>
              <Typography variant='caption' color='text.secondary'>
                Removed:
              </Typography>
              <Typography variant='body2' color='error.main' sx={{ textDecoration: 'line-through' }}>
                {diff.removed.join(', ')}
              </Typography>
            </Box>
          )}
          {diff.added.length > 0 && (
            <Box sx={{ pl: 2 }}>
              <Typography variant='caption' color='text.secondary'>
                Added:
              </Typography>
              <Typography variant='body2' color='success.main'>
                {diff.added.join(', ')}
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  )
}

const ReferencesChangesContent = ({ reference, original }) => {
  return (
    <Stack spacing={3} sx={{ minWidth: 500 }}>
      <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <ReferenceChanges
          label='Citation'
          oldValue={original.citation}
          newValue={reference.citation}
        />
        <ReferenceChanges
          label='DOI'
          oldValue={original.doi}
          newValue={reference.doi}
        />
        <ReferenceChanges
          label='Concepts'
          oldValue={original.concepts}
          newValue={reference.concepts}
          isArray={true}
        />
      </Stack>

      <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', fontStyle: 'italic' }}>
        Click Confirm to save these changes, or Cancel to return to editing.
      </Typography>
    </Stack>
  )
}

export default ReferencesChangesContent
