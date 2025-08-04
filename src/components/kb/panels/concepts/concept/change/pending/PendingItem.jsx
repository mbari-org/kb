import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { otherApprovalSx } from '@/components/common/format'

import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

const { APPROVAL } = PENDING

const PendingItem = ({ group, item }) => {
  const approval = usePendingItemApproval(item)

  const itemSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const itemTitle = pendingActionValue(item)

  const pendingDetailTitle = (
    <>
      <PendingButtons approval={approval} group={group} item={item} />
      <PendingItemTitle sx={itemSx} action={item.action} title={itemTitle} />
    </>
  )

  const pendingDetailValues = (
    <PendingValues pendingValues={pendingInfo(item)} disabled={disabled} />
  )

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default PendingItem
