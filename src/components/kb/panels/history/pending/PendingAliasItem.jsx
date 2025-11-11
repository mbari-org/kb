import { Box } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { otherApprovalSx } from '@/components/common/format'
import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'
import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const PendingAliasItem = ({ item }) => {
  if (!item || item.field !== HISTORY_FIELD.ALIAS) return null

  const title = pendingActionValue(item)
  const aliasSx = otherApprovalSx(PENDING.APPROVAL.ACCEPT)

  const pendingDetailTitle = (
    <Box>
      <PendingItemTitle sx={aliasSx} action={item.action} title={title} />
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

export default PendingAliasItem
