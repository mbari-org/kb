import { getConceptByName as apiGetConcept, getConceptNamesById } from '@/lib/api/concept'
import { updatePendingItem } from '@/lib/api/history'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PENDING } from '@/lib/constants/pending.js'
import { createError } from '@/lib/errors'
import { snapshotFromRawConcept } from '@/lib/model/aliases'
import { getConcept as getTaxonomyConcept } from '@/lib/model/taxonomy'

import { applyApprovals } from '@/lib/concept/pending/applyApproves'
import { applyRejects } from '@/lib/concept/pending/applyRejects'
import cloneStale from '@/lib/concept/pending/cloneStale'
import enqueueConceptMutation from '@/lib/concept/enqueueConceptMutation'
import { isPendingName } from '@/lib/concept/state/name'
import { createRenameRejectBlocked, RENAME_REJECT_REASON } from '@/lib/concept/pending/renameRejectBlocked'

// processPendingApproval handles both pending approve and reject. The nomenclature is approval reject or approval
// approve.

const restoredChildName = (approval, item) => {
  if (item.field !== HISTORY_FIELD.CHILD) return null
  if (approval === PENDING.APPROVAL.ACCEPT && item.action === ACTION.ADD) return item.newValue
  if (approval === PENDING.APPROVAL.REJECT && item.action === ACTION.DELETE) return item.oldValue
  return null
}

const isAliasItem = item => item.field === HISTORY_FIELD.ALIAS && !isPendingName(item)

const isSupersededChildAdd = (getConcept, approval, item) => {
  if (approval !== PENDING.APPROVAL.ACCEPT) return false
  if (item.field !== HISTORY_FIELD.CHILD || item.action !== ACTION.ADD) return false
  const child = getConcept(item.newValue)
  return Boolean(child) && child.parent !== item.concept
}

const removedChildName = (approval, item) => {
  if (item.field !== HISTORY_FIELD.CHILD) return null
  if (approval === PENDING.APPROVAL.ACCEPT && item.action === ACTION.DELETE) return item.oldValue
  if (approval === PENDING.APPROVAL.REJECT && item.action === ACTION.ADD) return item.recordedName
  return null
}

const validateRestoredChildren = async (apiFns, approval, items) => {
  for (const item of items) {
    const childName = restoredChildName(approval, item)
    if (!childName) continue

    const { error } = await apiFns.apiRaw(apiGetConcept, childName)
    if (error) {
      const instead =
        approval === PENDING.APPROVAL.ACCEPT ? 'Reject the pending add instead.' : 'Approve the pending delete instead.'
      throw createError(
        'Stale Pending Child',
        `Cannot ${approval} the pending ${item.action.toLowerCase()} of child "${childName}" on "${item.concept}" because the concept no longer exists. ${instead}`,
        { approval, item },
        error
      )
    }
  }
}

const HTTP_NOT_FOUND = 404

const validateRenameRejects = async (apiFns, approval, items) => {
  if (approval !== PENDING.APPROVAL.REJECT) return

  for (const item of items.filter(isPendingName)) {
    const { error, payload, status } = await apiFns.apiRaw(apiGetConcept, item.oldValue)
    if (!error) {
      if (payload.name === item.oldValue) {
        throw createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, item.oldValue)
      }
      throw createRenameRejectBlocked(RENAME_REJECT_REASON.ALIAS_HELD, item.oldValue, payload.name)
    }
    if (status !== HTTP_NOT_FOUND) throw error
  }
}

const processPendingApprovalUnlocked = async ({
  approval,
  items,
  deps: {
    apiFns,
    conceptEditsRefresh,
    getConcept,
    loadConcept,
    refreshData,
    reloadConceptRealizations,
    removeSelectedConceptName,
    resetConceptPaths,
    updateSelected,
  },
}) => {
  if (!items || items.length === 0) return { concepts: {}, pendingHistory: [], removed: [], updated: [] }

  await validateRestoredChildren(apiFns, approval, items)
  await validateRenameRejects(apiFns, approval, items)

  const supersededAddIds = new Set(
    items.filter(item => isSupersededChildAdd(getConcept, approval, item)).map(item => item.id)
  )

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
    const { error } = await apiFns.apiRaw(updatePendingItem, [approval, item.id])
    if (error) {
      await refreshData(PANEL_DATA.PENDING_HISTORY)
      throw createError(
        'Pending Update Failed',
        `Failed to ${approval} the pending ${item.field} change on "${item.concept}". Any earlier items in this batch were already processed; the pending list has been refreshed.`,
        { approval, item },
        error
      )
    }
  }

  const structuralFields = [HISTORY_FIELD.NAME, HISTORY_FIELD.PARENT]
  if (items.some(item => structuralFields.includes(item.field))) {
    resetConceptPaths()
  }

  // A rejected rename has already restored the old name on ONI, so reload against oldValue.
  const effectiveName = conceptName => {
    if (approval !== PENDING.APPROVAL.REJECT) return conceptName
    const nameItem = items.find(item => isPendingName(item) && item.concept === conceptName)
    return nameItem ? nameItem.oldValue : conceptName
  }

  const realizationConcepts = [
    ...new Set(items.filter(item => item.field === HISTORY_FIELD.REALIZATION).map(item => effectiveName(item.concept))),
  ]

  const [{ pendingHistory }] = await Promise.all([
    refreshData(PANEL_DATA.PENDING_HISTORY),
    ...realizationConcepts.map(conceptName => reloadConceptRealizations(conceptName)),
  ])

  const updated = []
  const concepts = {}
  const removedNames = new Set(items.map(item => removedChildName(approval, item)).filter(Boolean))

  let committedTaxonomy = null
  for (const conceptName of Object.keys(groups)) {
    const conceptItems = groups[conceptName]
    const staleConcept = committedTaxonomy
      ? getTaxonomyConcept(committedTaxonomy, conceptName)
      : staleConcepts[conceptName]
    if (!staleConcept) continue

    let freshConcept = staleConcept

    // Use the local stale concept as the base for optimistic updates
    if (approval === PENDING.APPROVAL.REJECT) {
      freshConcept = await cloneStale(apiFns, staleConcept, false)
      applyRejects(freshConcept, conceptItems)
    } else if (approval === PENDING.APPROVAL.ACCEPT) {
      freshConcept = await cloneStale(apiFns, staleConcept, false)
      applyApprovals(
        freshConcept,
        conceptItems.filter(item => !supersededAddIds.has(item.id))
      )
    }

    if (conceptItems.some(isAliasItem) && !removedNames.has(conceptName)) {
      const { aliases, alternateNames } = snapshotFromRawConcept(
        await apiFns.apiPayload(getConceptNamesById, freshConcept.primaryNameId)
      )
      freshConcept.aliases = aliases
      freshConcept.alternateNames = alternateNames
    }

    const { concept: updatedConcept, taxonomy } = await conceptEditsRefresh(freshConcept, staleConcept)
    committedTaxonomy = taxonomy

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
        removeSelectedConceptName(item.recordedName)
        removed.push(item.recordedName)
      }
    })

  return { concepts, pendingHistory, removed, updated }
}

export const processPendingApproval = args => enqueueConceptMutation(() => processPendingApprovalUnlocked(args))

export default processPendingApproval
