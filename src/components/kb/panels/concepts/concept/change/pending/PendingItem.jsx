import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { otherApprovalSx } from '@/components/common/format'

import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo, pendingItemLabel } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'

const { APPROVAL } = PENDING

const PendingItem = ({ infoRows = [], item }) => {
  const approval = usePendingItemApproval(item)

  const itemSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const pendingDetailTitle = (
    <PendingItemTitle sx={itemSx} action={pendingItemLabel(item)} title={pendingActionValue(item)} />
  )
  const pendingDetailValues = <PendingValues disabled={disabled} leftMargin={2.1} pendingValues={[...infoRows, ...pendingInfo(item)]} />

  return (
    <PendingDetail
      pendingDetailButtons={<PendingButtons approval={approval} item={item} />}
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default PendingItem
