import { use, useCallback, useMemo } from 'react'

import { Stack } from '@mui/material'

import { IoCheckmarkSharp as AcceptIcon, IoCloseSharp as RejectIcon } from 'react-icons/io5'

import PendingButton from './PendingButton'

import HandIcon from '@/components/icon/HandIcon'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pendingIds } from '@/lib/model/history'

import { isAdmin } from '@/lib/auth/role'

import { PENDING } from '@/lib/constants/pending.js'

const { ACCEPT, OTHER, REJECT } = PENDING.APPROVAL

const PendingButtons = ({ approval, group, item }) => {
  const { user } = use(UserContext)
  const { concept, pending, setPendingConfirm } = use(ConceptContext)

  const [disableReject, disableAccept, rejectIcon, acceptIcon] = useMemo(() => {
    if (!isAdmin(user)) {
      return [true, true, RejectIcon, AcceptIcon]
    }

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
  }, [approval, user])

  const handleClick = useCallback(
    clicked => {
      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      setPendingConfirm({
        approval: clicked,
        group,
        pendingIds: item ? [item.id] : pendingIds(pendingConcept, group, concept.name),
      })
    },
    [concept.name, group, pending, item, setPendingConfirm]
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
