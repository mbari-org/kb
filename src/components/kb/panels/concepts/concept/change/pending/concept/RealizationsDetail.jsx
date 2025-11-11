import { Stack, Typography } from '@mui/material'

import RealizationDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RealizationDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { isPendingRealization } from '@/lib/kb/state/realizations'

import { PENDING } from '@/lib/constants/pending.js'

const { REALIZATIONS } = PENDING.GROUP

const RealizationsDetail = ({ pendingConcept }) => {
  const pendingRealizations = pendingConcept.filter(isPendingRealization)

  const approval = usePendingGroupApproval(REALIZATIONS)
  const realizationsSx = otherApprovalSx(approval)

  if (pendingRealizations.length === 0) {
    return null
  }

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={REALIZATIONS} />
      <Typography sx={realizationsSx}>Realizations</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Stack direction='column' spacing={1}>
      {pendingRealizations.map(pendingRealization => (
        <RealizationDetail key={pendingRealization.id} pendingRealization={pendingRealization} />
      ))}
    </Stack>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default RealizationsDetail
