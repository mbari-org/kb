import { updatePendingItem } from '@/lib/api/history'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PENDING } from '@/lib/constants/pending.js'

import { applyApprovals } from '@/lib/concept/pending/applyApproves'
import { applyRejects } from '@/lib/concept/pending/applyRejects'
import cloneStale from '@/lib/concept/pending/cloneStale'

export const processPendingApproval = async ({
  approval,
  items,
  deps: { apiFns, conceptEditsRefresh, getConcept, refreshData, updateSelected },
  strategy = { accept: 'apply', reject: 'apply' },
}) => {
  if (!items || items.length === 0) return { updated: [] }

  await Promise.all(items.map(item => apiFns.apiPayload(updatePendingItem, [approval, item.id])))

  await refreshData(PANEL_DATA.ALL)

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
