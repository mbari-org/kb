import { PENDING } from '@/lib/kb/constants/pending.js'
import { updatePendingItem } from '@/lib/kb/api/history'

import { applyApprovals } from '@/lib/kb/pending/applyApproves'
import { applyRejects } from '@/lib/kb/pending/applyRejects'
import cloneStale from '@/lib/kb/pending/cloneStale'

export const processPendingApproval = async ({
  approval,
  items,
  deps: { apiFns, getConcept, conceptEditsRefresh, updateSelected, refreshHistory },
  strategy = { accept: 'apply', reject: 'apply' },
}) => {
  if (!items || items.length === 0) return { updated: [] }

  await Promise.all(items.map(item => apiFns.apiPayload(updatePendingItem, [approval, item.id])))

  if (typeof refreshHistory === 'function') {
    await refreshHistory()
  }

  const groups = items.reduce((acc, item) => {
    const key = item.concept
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const updated = []

  for (const conceptName of Object.keys(groups)) {
    const conceptItems = groups[conceptName]
    const staleConcept = getConcept(conceptName)
    if (!staleConcept) continue

    let freshConcept = staleConcept

    if (approval === PENDING.APPROVAL.REJECT && strategy.reject === 'apply') {
      freshConcept = await cloneStale(apiFns, staleConcept, true)
      applyRejects(freshConcept, conceptItems)
    } else if (approval === PENDING.APPROVAL.ACCEPT && strategy.accept === 'apply') {
      freshConcept = await cloneStale(apiFns, staleConcept, false)
      applyApprovals(freshConcept, conceptItems)
    }

    const { concept: updatedConcept } = await conceptEditsRefresh(freshConcept, staleConcept)

    if (updatedConcept && updatedConcept.name && updatedConcept.name !== staleConcept.name) {
      if (typeof updateSelected === 'function') {
        updateSelected({ concept: updatedConcept.name })
      }
    }

    updated.push(updatedConcept?.name || conceptName)
  }

  return { updated }
}

export default processPendingApproval
