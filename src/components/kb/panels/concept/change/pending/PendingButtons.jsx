import { use, useCallback, useMemo } from 'react'

import { Stack } from '@mui/material'

import { IoCheckmarkSharp as AcceptIcon, IoCloseSharp as RejectIcon } from 'react-icons/io5'

import PendingButton from './PendingButton'

import HandIcon from '@/components/common/HandIcon'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { PENDING } from '@/lib/constants'

const { ACCEPT, OTHER, REJECT } = PENDING.APPROVAL

const PendingButtons = ({ approval, group, pendingItemId }) => {
  const { setConfirmPending } = use(ConceptContext)

  const [disableReject, disableAccept, rejectIcon, acceptIcon] = useMemo(() => {
    if (!approval) return [false, false, RejectIcon, AcceptIcon]
    if (approval === OTHER) return [true, true, RejectIcon, AcceptIcon]
    if (approval === ACCEPT) return [true, false, RejectIcon, HandIcon]
    if (approval === REJECT) return [false, true, HandIcon, AcceptIcon]
  }, [approval])

  const handleClick = useCallback(
    clickedApproval => {
      setConfirmPending({ approval: clickedApproval, group, pendingItemId })
    },
    [group, pendingItemId, setConfirmPending]
  )

  return (
    <Stack direction='row' sx={{ ml: 0.5, mr: 0.5 }}>
      <PendingButton
        Icon={acceptIcon}
        disabled={disableAccept}
        color='clean'
        onClick={() => handleClick(ACCEPT)}
      />
      <PendingButton
        Icon={rejectIcon}
        disabled={disableReject}
        color='remove'
        onClick={() => handleClick(REJECT)}
      />
    </Stack>
  )
}

export default PendingButtons
