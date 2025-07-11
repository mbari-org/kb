import { useMemo } from 'react'

import { Box } from '@mui/material'

import ActionsAlert from './ActionsAlert'
import { PENDING } from '@/lib/constants'

const { ACCEPT, REJECT } = PENDING.APPROVAL

const PendingAlert = ({ confirmPending }) => {
  const { approval } = confirmPending

  const [severity, line1, line2] = useMemo(() => {
    if (approval === ACCEPT) return ['info', 'approval', 'approve']
    if (approval === REJECT) return ['error', 'rejection', 'reject']
  }, [approval])

  return (
    <ActionsAlert
      line1={`Pending edit ${line1} is final.`}
      line2={`Please confirm you want to ${line2} the indicated pending edits.`}
      severity={severity}
    />
  )
}

export default PendingAlert
