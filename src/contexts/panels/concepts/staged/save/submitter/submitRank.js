import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptById } from '@/lib/api/concept'

const buildRankSubmit = (op, effective) => {
  const rankUpdate = {
    rankLevel: op.item.level,
    rankName: op.item.name,
  }
  const params = [effective.state.id, rankUpdate]
  return {
    apiFn: updateConceptById,
    params,
    tracker: {
      action: CONCEPT_STATE.RANK,
      field: CONCEPT.FIELD.RANK,
      update: rankUpdate,
    },
  }
}

export default buildRankSubmit
