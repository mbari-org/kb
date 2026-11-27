import { PENDING } from '@/lib/constants/pending.js'
import { moveAddToFirst, moveAddToLast, moveDeleteToLast } from '@/lib/model/history'

const byCreation = (a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp)

const orderPendingBatch = (approval, items) => {
  const chronological = [...items].sort(byCreation)
  const directional = approval === PENDING.APPROVAL.REJECT ? chronological.reverse() : chronological
  const withAdd =
    approval === PENDING.APPROVAL.ACCEPT ? moveAddToFirst(directional) : moveAddToLast(directional)
  return moveDeleteToLast(withAdd)
}

export default orderPendingBatch
