import { snapshotFromRawConcept } from '@/lib/model/aliases'

const applyNameResults = ({ concept, result }) => {
  Object.assign(concept, snapshotFromRawConcept(result.response))
}

export default applyNameResults
