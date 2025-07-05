import { use, useCallback, useMemo } from 'react'

import { Stack } from '@mui/material'

import { IoCheckmarkSharp as AcceptIcon, IoCloseSharp as RejectIcon } from 'react-icons/io5'

import PendingButton from './PendingButton'

import HandIcon from '@/components/common/HandIcon'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { getPendingIds } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { isAdmin } from '@/lib/auth/role'

import { PENDING } from '@/lib/constants'

const { ACCEPT, OTHER, REJECT } = PENDING.APPROVAL

const PendingButtons = ({ approval, pending }) => {
  const { user } = use(UserContext)
  const { setConfirmPending, concept } = use(ConceptContext)
  const { pendingHistory } = use(PanelDataContext)

  const conceptPending = useMemo(() => {
    return pendingHistory.filter(history => history.concept === concept.name)
  }, [pendingHistory, concept.name])

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
      const pendingIds = getPendingIds(conceptPending, pending, concept.name)
      setConfirmPending({ approval: clicked, pending, pendingIds })
    },
    [pending, setConfirmPending, conceptPending, concept.name]
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
