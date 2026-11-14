import { use, useCallback, useMemo } from 'react'

import { Stack } from '@mui/material'

import { IoCheckmarkSharp as AcceptIcon, IoCloseSharp as RejectIcon } from 'react-icons/io5'

import PendingButton from './PendingButton'

import HandIcon from '@/components/icon/HandIcon'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/constants/pending.js'

const { ACCEPT, OTHER, REJECT } = PENDING.APPROVAL

const PendingButtons = ({ approval, item }) => {
  const { isAdmin } = use(UserContext)
  const { setPendingConfirm } = use(ConceptContext)

  const [shouldHide, disableReject, disableAccept, rejectIcon, acceptIcon] = useMemo(() => {
    if (!isAdmin) {
      return [true, true, true, RejectIcon, AcceptIcon]
    }

    switch (approval) {
      case OTHER:
        return [false, true, true, RejectIcon, AcceptIcon]
      case ACCEPT:
        return [false, true, false, RejectIcon, HandIcon]
      case REJECT:
        return [false, false, true, HandIcon, AcceptIcon]
      default:
        return [false, false, false, RejectIcon, AcceptIcon]
    }
  }, [approval, isAdmin])

  if (shouldHide) {
    return null
  }

  const handleClick = useCallback(
    clicked => {
      setPendingConfirm({
        approval: clicked,
        pendingIds: [item.id],
      })
    },
    [item, setPendingConfirm]
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
