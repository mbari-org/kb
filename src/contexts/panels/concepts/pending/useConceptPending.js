import { use, useMemo } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'

const useConceptPending = conceptName => {
  const { history } = use(PanelDataContext)

  const conceptPending = useMemo(
    () => {
      if (!conceptName) return history.pending
      return history.pending.filter(historyItem => historyItem.concept === conceptName)
    },
    [conceptName, history.pending]
  )

  return conceptPending
}

export default useConceptPending
