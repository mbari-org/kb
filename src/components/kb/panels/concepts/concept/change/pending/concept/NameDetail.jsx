import { use, useEffect } from 'react'

import { Box, Typography } from '@mui/material'

import NameChangeExtent from '@/components/common/NameChangeExtent'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import { otherApprovalSx } from '@/components/common/format'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { formatDelta } from '@/components/common/format'
import { isAdmin } from '@/lib/auth/role'
import { isPendingName } from '@/lib/kb/state/name'
import { pendingInfo } from '@/lib/kb/model/history'

import { LABELS, PENDING } from '@/lib/constants'

const { APPROVAL, GROUP } = PENDING
const { NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME

const NameDetail = ({ pendingConcept }) => {
  const { modalData, setModalData } = use(ConceptModalContext)
  const { user } = use(UserContext)

  const approval = usePendingGroupApproval(GROUP.NAME)

  useEffect(() => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: NAME_ONLY,
    }))
  }, [setModalData])

  const pendingName = pendingConcept.find(isPendingName)
  if (!pendingName) {
    return null
  }

  const nameChangeType = modalData?.nameChangeType

  const handleNameChangeType = event => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: event.target.value,
    }))
  }

  const enableExtent = approval === APPROVAL.ACCEPT
  const isAdminUser = isAdmin(user)

  const nameSx = otherApprovalSx(approval)

  const nameDelta = formatDelta(pendingName.oldValue, pendingName.newValue)

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={GROUP.NAME} />
      <Typography sx={nameSx}>Name: </Typography>
      <Typography sx={{ ...nameSx, fontWeight: 'bold' }}>{nameDelta}</Typography>
    </>
  )

  const pendingGroupDetail = (
    <>
      <PendingValues
        disabled={approval === APPROVAL.OTHER}
        pendingValues={pendingInfo(pendingName)}
      />
      {isAdminUser && (
        <Box sx={{ ml: 16 }}>
          <NameChangeExtent
            disabled={!enableExtent}
            nameChangeType={nameChangeType}
            onChange={handleNameChangeType}
          />
        </Box>
      )}
    </>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default NameDetail
