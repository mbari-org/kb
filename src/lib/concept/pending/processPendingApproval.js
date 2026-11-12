import { updatePendingItem } from '@/lib/api/history'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
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
  deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, resetConceptPaths, updateSelected },
}) => {
  if (!items || items.length === 0) return { concepts: {}, pendingHistory: [], removed: [], updated: [] }

  const groups = items.reduce((acc, item) => {
    const key = item.concept
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const staleConcepts = {}
  for (const conceptName of Object.keys(groups)) {
    if (!getConcept(conceptName)) continue
    staleConcepts[conceptName] = await loadConcept(conceptName)
  }

  for (const item of items) {
    await apiFns.apiPayload(updatePendingItem, [approval, item.id])
  }

  const structuralFields = [HISTORY_FIELD.NAME, HISTORY_FIELD.PARENT]
  if (items.some(item => structuralFields.includes(item.field))) {
    resetConceptPaths()
  }

  const realizationConcepts = [
    ...new Set(items.filter(item => item.field === HISTORY_FIELD.REALIZATION).map(item => item.concept)),
  ]

  const [{ pendingHistory }] = await Promise.all([
    refreshData(PANEL_DATA.PENDING_HISTORY),
    ...realizationConcepts.map(conceptName => reloadConceptRealizations(conceptName)),
  ])

  const updated = []
  const concepts = {}

  for (const conceptName of Object.keys(groups)) {
    const conceptItems = groups[conceptName]
    const staleConcept = staleConcepts[conceptName]
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
      concepts[conceptName] = updatedConcept
    }
  }

  const removed = []
  items
    .filter(item => item.field === HISTORY_FIELD.CHILD)
    .forEach(item => {
      if (approval === PENDING.APPROVAL.ACCEPT && item.action === ACTION.DELETE) {
        removeSelectedConceptName(item.oldValue)
        removed.push(item.oldValue)
      }
      if (approval === PENDING.APPROVAL.REJECT && item.action === ACTION.ADD) {
        removeSelectedConceptName(item.newValue)
        removed.push(item.newValue)
      }
    })

  return { concepts, pendingHistory, removed, updated }
}

export default processPendingApproval
