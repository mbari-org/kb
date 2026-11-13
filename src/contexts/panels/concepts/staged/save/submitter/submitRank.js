import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptRank } from '@/lib/api/concept'

const buildRankSubmit = (op, effective) => {
  const rankUpdate = {
    rankLevel: op.item.level,
    rankName: op.item.name,
  }
  const params = [effective.state.name, rankUpdate]
  return {
    apiFn: updateConceptRank,
    params,
    tracker: {
      action: CONCEPT_STATE.RANK,
      field: CONCEPT.FIELD.RANK,
      update: rankUpdate,
    },
  }
}

export default buildRankSubmit
