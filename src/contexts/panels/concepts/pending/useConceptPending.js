import { use, useCallback, useMemo, useState } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { isPendingAdd } from '@/lib/model/history'
import { PENDING } from '@/lib/constants/pending.js'

const { CONCEPT, CONFIRM, PARENT } = PENDING.DATA

const conceptPendingHistory = (conceptName, pendingHistory) => {
  if (!conceptName || !pendingHistory) return []

  return pendingHistory.filter(historyItem => historyItem.concept === conceptName)
}

const parentPendingHistory = (conceptName, parentName, pendingHistory) => {
  if (!parentName || !pendingHistory) return []

  return pendingHistory.filter(
    historyItem =>
      historyItem.concept === parentName || (isPendingAdd(historyItem) && historyItem.newValue === conceptName)
  )
}

const useConceptPending = concept => {
  const { pendingHistory } = use(PanelDataContext)

  const [confirmState, setConfirmState] = useState(null)

  const pendingData = useMemo(() => {
    if (!concept) return { [CONCEPT]: [], [PARENT]: [] }

    return {
      [CONCEPT]: conceptPendingHistory(concept.name, pendingHistory),
      [PARENT]: parentPendingHistory(concept.name, concept.parent, pendingHistory),
    }
  }, [concept, pendingHistory])

  const confirmData = useMemo(() => {
    if (!confirmState) return null

    const listedIds = [...pendingData[CONCEPT], ...pendingData[PARENT]].map(item => item.id)
    return confirmState.pendingIds.every(id => listedIds.includes(id)) ? confirmState : null
  }, [confirmState, pendingData])

  const pending = useCallback(
    field => (field === CONFIRM ? confirmData : pendingData[field]),
    [confirmData, pendingData]
  )

  const setPendingConfirm = useCallback(data => setConfirmState(data), [])

  return {
    pending,
    setPendingConfirm,
  }
}

export default useConceptPending
