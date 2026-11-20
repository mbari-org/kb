import { Box } from '@mui/material'

import ActionsAlert from './ActionsAlert'
import { PENDING } from '@/lib/constants/pending.js'

import CONFIG from '@/lib/config'

const { ACCEPT, REJECT } = PENDING.APPROVAL
const { PENDING: PENDING_ALERT } = CONFIG.UI.ACTION_ALERT

const PendingAlert = ({ approval }) => {
  const isAccept = approval === ACCEPT
  const isReject = approval === REJECT

  return (
    <Box>
      {!!isAccept && (
        <ActionsAlert lines={PENDING_ALERT.ACCEPT} severity={'info'} />
      )}
      {!!isReject && (
        <ActionsAlert lines={PENDING_ALERT.REJECT} severity={'error'} />
      )}
    </Box>
  )
}

export default PendingAlert
