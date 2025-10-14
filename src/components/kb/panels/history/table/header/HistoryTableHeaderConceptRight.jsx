import { use } from 'react'

import ConceptExtent from '@/components/common/concept/ConceptExtent'
import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderConceptRight = () => {
  const { conceptState, updateConceptState } = use(HistoryContext)

  return (
    <ConceptExtent
      initialValue={conceptState.extent}
      onChange={extent => updateConceptState({ extent })}
    />
  )
}

export default HistoryTableHeaderConceptRight
