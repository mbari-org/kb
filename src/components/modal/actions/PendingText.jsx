import { useMemo } from 'react'

import { Box } from '@mui/material'

import ActionsText from './ActionsText'

import { PENDING } from '@/lib/constants'

const { ACCEPT, REJECT } = PENDING.APPROVAL

const PendingText = ({ approval }) => {
  const [color, line1, line2] = useMemo(() => {
    if (approval === ACCEPT) return ['clean', 'approval', 'approve']
    if (approval === REJECT) return ['cancel', 'rejection', 'reject']
  }, [approval])

  return (
    <Box>
      <ActionsText color={color} text={`Pending edit ${line1} is final.`} />
      <ActionsText
        color={color}
        text={`Please confirm you want to ${line2} the indicated pending edits.`}
      />
    </Box>
  )
}

export default PendingText
