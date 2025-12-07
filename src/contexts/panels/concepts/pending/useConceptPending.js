import { use, useCallback, useEffect, useState } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/kb/constants/historyField.js'
import { PENDING } from '@/lib/kb/constants/pending.js'

const { CONCEPT, CONFIRM, PARENT } = PENDING.DATA

const useConceptPending = concept => {
  const { pendingHistory } = use(PanelDataContext)

  const [pendingData, setPendingData] = useState({
    [CONCEPT]: [],
    [CONFIRM]: null,
    [PARENT]: [],
  })

  const conceptPendingHistory = (conceptName, pendingHistory) => {
    if (!conceptName || !pendingHistory) return []

    const pendingConcept = pendingHistory.filter(historyItem => historyItem.concept === conceptName)
    const childPending = pendingHistory.find(
      historyItem =>
        historyItem.action === ACTION.ADD &&
        historyItem.field === HISTORY_FIELD.CHILD &&
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
      const timeoutId = setTimeout(() => {
        setPendingData({
          [CONCEPT]: newConceptData,
          [CONFIRM]: null,
          [PARENT]: parentPendingHistory(concept.parent, pendingHistory),
        })
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [concept, pendingHistory])

  const pending = useCallback(field => pendingData[field], [pendingData])

  const setPendingConfirm = useCallback(confirmData => {
    setPendingData(prev => ({
      ...prev,
      [CONFIRM]: confirmData,
    }))
  }, [])

  return {
    pending,
    setPendingConfirm,
  }
}

export default useConceptPending
