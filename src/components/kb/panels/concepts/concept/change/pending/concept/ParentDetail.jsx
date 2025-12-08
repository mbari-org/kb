import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { pendingInfo } from '@/lib/model/history'

import { formatDelta, otherApprovalSx } from '@/components/common/format'

import { isPendingParent } from '@/lib/concept/state/parent'

import { PENDING } from '@/lib/constants/pending.js'

const { APPROVAL, GROUP } = PENDING

const ParentDetail = ({ pendingConcept }) => {
  const approval = usePendingGroupApproval(GROUP.PARENT)

  const pendingParent = pendingConcept.find(isPendingParent)
  if (!pendingParent) {
    return null
  }

  const parentValue = formatDelta(pendingParent.oldValue, pendingParent.newValue)

  const aliasSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const pendingDetailTitle = (
    <>
      <PendingButtons approval={approval} item={pendingParent} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={aliasSx}>Parent:</Typography>
        <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{parentValue}</Typography>
      </Box>
    </>
  )

  const pendingDetailValues = (
    <PendingValues pendingValues={pendingInfo(pendingParent)} disabled={disabled} />
  )

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default ParentDetail
