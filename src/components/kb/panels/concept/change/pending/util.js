import { fieldPendingHistory } from '@/lib/kb/model/history'
import { humanTimestamp } from '@/lib/util'

const pendingAliases = (concept, pendingHistory) => {
  const pendingConceptNames = fieldPendingHistory(pendingHistory, 'ConceptName')
  return pendingConceptNames.filter(
    pendingConceptName => pendingConceptName.newValue !== concept.name
  )
}

const pendingValues = pending => {
  return [
    ['creator', pending.creatorName],
    ['created', humanTimestamp(pending.creationTimestamp)],
  ]
}

export { pendingValues }
