import { use, useCallback, useMemo } from 'react'

import { Stack } from '@mui/material'

import { IoCheckmarkSharp as AcceptIcon, IoCloseSharp as RejectIcon } from 'react-icons/io5'

import PendingButton from './PendingButton'

import HandIcon from '@/components/common/HandIcon'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { PENDING } from '@/lib/constants'

const { ACCEPT, OTHER, REJECT } = PENDING.APPROVAL

const PendingButtons = ({ approval, pending }) => {
  const { setConfirmPending } = use(ConceptContext)

  const [disableReject, disableAccept, rejectIcon, acceptIcon] = useMemo(() => {
    switch (approval) {
      case OTHER:
        return [true, true, RejectIcon, AcceptIcon]
      case ACCEPT:
        return [true, false, RejectIcon, HandIcon]
      case REJECT:
        return [false, true, HandIcon, AcceptIcon]
      default:
        return [false, false, RejectIcon, AcceptIcon]
    }
  }, [approval])

  const handleClick = useCallback(
    clicked => {
      setConfirmPending({ approval: clicked, pending })
    },
    [pending, setConfirmPending]
  )

  const [acceptApproved, rejectApproved] = !approval
    ? [false, false]
    : [!disableAccept, !disableReject]

  return (
    <Stack direction='row' sx={{ ml: 0.5, mr: 0.5 }}>
      <PendingButton
        Icon={acceptIcon}
        color='clean'
        determined={acceptApproved}
        disabled={disableAccept}
        onClick={() => handleClick(ACCEPT)}
      />
      <PendingButton
        Icon={rejectIcon}
        color='remove'
        determined={rejectApproved}
        disabled={disableReject}
        onClick={() => handleClick(REJECT)}
      />
    </Stack>
  )
}

export default PendingButtons
