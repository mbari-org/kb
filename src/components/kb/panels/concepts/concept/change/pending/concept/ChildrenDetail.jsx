import { Stack, Typography } from '@mui/material'

import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { isPendingChild } from '@/lib/concept/state/children'

import CONFIG from '@/text'

const { CHILDREN } = CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT

const sortChildren = (a, b) => {
  const aValue = a.newValue ?? a.oldValue
  const bValue = b.newValue ?? b.oldValue
  return aValue.localeCompare(bValue)
}

const ChildrenDetail = ({ pendingConcept }) => {
  const pendingChildren = pendingConcept.filter(isPendingChild).sort(sortChildren)

  const approval = usePendingGroupApproval(CHILDREN)

  const childrenSx = otherApprovalSx(approval)

  if (pendingChildren.length === 0) {
    return null
  }

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={CHILDREN} />
      <Typography sx={childrenSx}>Children</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Stack direction='column' spacing={1}>
      {pendingChildren.map(pendingChild => (
        <ChildDetail key={pendingChild.id} pendingChild={pendingChild} />
      ))}
    </Stack>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default ChildrenDetail
