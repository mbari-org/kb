import { use } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'

const useConceptHasPendingDelete = conceptName => {
  const { pendingHistory } = use(PanelDataContext)

  return Boolean(
    conceptName &&
      pendingHistory.some(
        item => item.field === HISTORY_FIELD.CHILD && item.action === ACTION.DELETE && item.oldValue === conceptName
      )
  )
}

export default useConceptHasPendingDelete
