import { createHistoryStore, getHistoryStore } from '@/lib/store/historyStore'

import { STORE } from '@/lib/constants'

const createConceptStore = defaultConcept =>
  createHistoryStore(STORE.CONCEPT.KEY, STORE.CONCEPT.MAX_SIZE, defaultConcept)

const getConceptStore = () => getHistoryStore(STORE.CONCEPT.KEY)

export { createConceptStore, getConceptStore }
