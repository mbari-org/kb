import historyStore from '@/lib/store/historyStore'

import { STORE } from '@/lib/constants'

const createConceptStore = defaultConcept => {
  return historyStore(STORE.CONCEPT.KEY, STORE.CONCEPT.MAX_SIZE, defaultConcept)
}

export default createConceptStore
