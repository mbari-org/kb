import { use } from 'react'

import ConceptExtent from '@/components/common/concept/ConceptExtent'
import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderConceptRight = () => {
  const { conceptHistoryExtent, setConceptHistoryExtent } = use(HistoryContext)

  return (
    <ConceptExtent
      initialValue={conceptHistoryExtent}
      onChange={setConceptHistoryExtent}
    />
  )
}

export default HistoryTableHeaderConceptRight
