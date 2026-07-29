import { Box } from '@mui/material'

import ActionsAlert from './ActionsAlert'
import { PENDING } from '@/lib/constants/pending.js'

const { ACCEPT, REJECT } = PENDING.APPROVAL

const PendingAlert = ({ approval }) => {
  const isAccept = approval === ACCEPT
  const isReject = approval === REJECT

  return (
    <Box>
      {!!isAccept && (
        <ActionsAlert
          lines={['Pending edit approval is final.', 'Please confirm you want to approve the indicated pending edits.']}
          severity={'info'}
        />
      )}
      {!!isReject && (
        <ActionsAlert
          lines={['Pending edit rejection is final.', 'Please confirm you want to reject the indicated pending edits.']}
          severity={'error'}
        />
      )}
    </Box>
  )
}

export default PendingAlert
