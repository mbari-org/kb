import { use, useMemo } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

const useConceptPending = conceptName => {
  const { pendingHistory } = use(PanelDataContext)

  return useMemo(() => {
    if (!conceptName || !pendingHistory) return []
    return pendingHistory.filter(historyItem => historyItem.concept === conceptName)
  }, [conceptName, pendingHistory])
}

export default useConceptPending
