import { Box } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { otherApprovalSx } from '@/components/common/format'
import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'
import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants/pending.js'

const { APPROVAL } = PENDING

const PendingParentItem = ({ item }) => {
  const title = pendingActionValue(item)
  const parentSx = otherApprovalSx(APPROVAL.ACCEPT)

  const pendingDetailTitle = (
    <Box>
      <PendingItemTitle sx={parentSx} action={item.action} title={title} />
    </Box>
  )

  const pendingDetailValues = (
    <PendingValues disabled={false} leftMargin={6} pendingValues={pendingInfo(item)} />
  )

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default PendingParentItem
