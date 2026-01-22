import { updatePendingItem } from '@/lib/api/history'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PENDING } from '@/lib/constants/pending.js'

import { applyApprovals } from '@/lib/concept/pending/applyApproves'
import { applyRejects } from '@/lib/concept/pending/applyRejects'
import cloneStale from '@/lib/concept/pending/cloneStale'

// processPendingApproval handles both pending approve and reject. The nomenclature is approval reject or approval
// approve.

export const processPendingApproval = async ({
  approval,
  items,
  deps: { apiFns, conceptEditsRefresh, getConcept, refreshData, updateSelected },
}) => {
  if (!items || items.length === 0) return { updated: [], concepts: {} }

  await Promise.all(items.map(item => apiFns.apiPayload(updatePendingItem, [approval, item.id])))

  await refreshData(PANEL_DATA.ALL)

  const groups = items.reduce((acc, item) => {
    const key = item.concept
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const updated = []
  const concepts = {}

  for (const conceptName of Object.keys(groups)) {
    const conceptItems = groups[conceptName]
    const staleConcept = getConcept(conceptName)
    if (!staleConcept) continue

    let freshConcept = staleConcept

    // Use the local stale concept as the base for optimistic updates
    if (approval === PENDING.APPROVAL.REJECT) {
      freshConcept = await cloneStale(apiFns, staleConcept, false)
      applyRejects(freshConcept, conceptItems)
    } else if (approval === PENDING.APPROVAL.ACCEPT) {
      freshConcept = await cloneStale(apiFns, staleConcept, false)
      applyApprovals(freshConcept, conceptItems)
    }

    const { concept: updatedConcept } = await conceptEditsRefresh(freshConcept, staleConcept)

    const updatedName = updatedConcept?.name || conceptName

    if (updatedConcept && updatedConcept.name && updatedConcept.name !== staleConcept.name) {
      updateSelected({ concept: updatedConcept.name })
    }

    updated.push(updatedName)

    if (updatedConcept) {
      concepts[updatedName] = updatedConcept
    }
  }

  return { concepts, updated }
}

export default processPendingApproval
