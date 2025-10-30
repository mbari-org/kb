import { Box, Typography } from '@mui/material'

const AssociatedActions = ({ removalMessages, reassignmentMessages, isAdminUser, showNonAdminGuidance }) => {
  // const theme = useTheme()
  const hasRemovals = removalMessages?.length > 0
  const hasReassignments = reassignmentMessages?.length > 0
  const hasAssociated = hasRemovals || hasReassignments

  if (!hasAssociated) return null

  return (
    <Box>
      <Typography variant='body1' sx={{ fontSize: theme => theme.typography.fontSize * 1.2,
        fontWeight: 'bold', ml: 1, mt: 2 }}>
        {'Associated Actions:'}
      </Typography>
      <Box sx={{ ml: 6 }}>
      {hasRemovals && (
        <Box sx={{ mb: 2 }}>
          {removalMessages.map((message, index) => (
            <Typography key={`removal-${index}`} >
              {message}
            </Typography>
          ))}
        </Box>
      )}
      {hasReassignments && (
        <Box sx={{ mb: 2 }}>
          {reassignmentMessages.map((message, index) => (
            <Typography key={`reassignment-${index}`} >
              {message}
            </Typography>
          ))}
        </Box>
      )}
      </Box>
      {showNonAdminGuidance && !isAdminUser && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body1' color='text.secondary'>
            {'Please communicate with an admin regarding this change.'}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {'When approving, an admin must specify whether to modify data associated with the concept.'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default AssociatedActions
