import { use, useCallback, useEffect, useState } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { ACTION, PENDING } from '@/lib/constants'

const { CONCEPT, CONFIRM, PARENT } = PENDING.DATA

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
      const newConceptData = conceptPendingHistory(concept.name, pendingHistory)
      setPendingData({
        [CONCEPT]: newConceptData,
        [CONFIRM]: null,
        [PARENT]: parentPendingHistory(concept.parent, pendingHistory),
      })
    }
  }, [concept, pendingHistory])

  const pending = useCallback(field => {
    return pendingData?.[field]
  }, [pendingData])

  const setPendingConfirm = useCallback(
    confirmData => {
      setPendingData(prev => ({
        ...prev,
        [CONFIRM]: confirmData,
      }))
    },
    []
  )

  return {
    pending,
    setPendingConfirm,
  }
}

export default useConceptPending
