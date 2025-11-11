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
          line1={'Pending edit approval is final.'}
          line2={'Please confirm you want to approve the indicated pending edits.'}
          severity={'info'}
        />
      )}
      {!!isReject && (
        <ActionsAlert
          line1={'Pending edit rejection is final.'}
          line2={'Please confirm you want to reject the indicated pending edits.'}
          severity={'error'}
        />
      )}
    </Box>
  )
}

export default PendingAlert
