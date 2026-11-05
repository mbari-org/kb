import { Box } from '@mui/material'

import { actionColor } from '@/components/kb/panels/concepts/concept/change/action'

const ConceptPendingHistoryIcon = ({ pendingAction }) => {
  return (
    <Box
      sx={{
        bgcolor: actionColor(pendingAction),
        borderRadius: '70%',
        display: 'inline-block',
        height: 6,
        mt: 1,
        mx: 0.5,
        width: 6,
        zIndex: 1,
      }}
    />
  )
}

export default ConceptPendingHistoryIcon
