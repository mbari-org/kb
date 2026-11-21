import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { snapshotFromRawConcept } from '@/lib/model/aliases'

const applyAliasResults = ({ concept, result }) => {
  switch (result.action) {
    case CONCEPT_STATE.ALIAS.ADD:
    case CONCEPT_STATE.ALIAS.DELETE:
    case CONCEPT_STATE.ALIAS.EDIT:
      Object.assign(concept, snapshotFromRawConcept(result.response))
      break
    default:
      break
  }
}

export default applyAliasResults
