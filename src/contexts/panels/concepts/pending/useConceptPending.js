import { use, useMemo } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

const useConceptPending = conceptName => {
  const { pendingHistory } = use(PanelDataContext)

  return useMemo(() => {
    if (!conceptName || !pendingHistory) return []
    return pendingHistory.filter(historyItem => historyItem.concept === conceptName)
    // const conceptPending = pendingHistory.filter(historyItem => historyItem.concept === conceptName)
    // const childPending = pendingHistory.find(
    //   historyItem =>
    //     historyItem.action === 'ADD' &&
    //     historyItem.field === 'Concept.child' &&
    //     historyItem.newValue === conceptName
    // )
    // return childPending ? [...conceptPending, childPending] : conceptPending
  }, [conceptName, pendingHistory])
}

export default useConceptPending
