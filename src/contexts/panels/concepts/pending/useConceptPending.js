import { use, useCallback, useEffect, useState } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { ACTION, PENDING } from '@/lib/constants'

const useConceptPending = concept => {
  const { pendingHistory } = use(PanelDataContext)

  const [pendingData, setPendingData] = useState(null)

  const conceptPendingHistory = (conceptName, pendingHistory) => {
    if (!conceptName || !pendingHistory) return []

    const pendingConcept = pendingHistory.filter(historyItem => historyItem.concept === conceptName)
    const childPending = pendingHistory.find(
      historyItem =>
        historyItem.action === ACTION.ADD &&
        historyItem.field === 'Concept.child' &&
        historyItem.newValue === conceptName
    )
    return childPending ? [...pendingConcept, childPending] : pendingConcept
  }

  const parentPendingHistory = (parentName, pendingHistory) => {
    if (!parentName || !pendingHistory) return []
    return pendingHistory.filter(historyItem => historyItem.concept === parentName)
  }

  useEffect(() => {
    if (concept) {
      setPendingData(prev => ({
        ...prev,
        [PENDING.DATA.CONCEPT]: conceptPendingHistory(concept.name, pendingHistory),
        [PENDING.DATA.CONFIRM]: null,
        [PENDING.DATA.PARENT]: parentPendingHistory(concept.parent, pendingHistory),
      }))
    }
  }, [concept, pendingHistory])

  // Public function to get pending data by field
  const pending = useCallback(field => pendingData?.[field], [pendingData])

  // Public function to set only the CONFIRM field
  const setPendingConfirm = useCallback(confirmData => {
    setPendingData(prev => ({
      ...prev,
      [PENDING.DATA.CONFIRM]: confirmData,
    }))
  }, [])

  return {
    pending,
    setPendingConfirm,
  }
}

export default useConceptPending
