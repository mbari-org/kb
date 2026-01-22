import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptRank } from '@/lib/api/concept'

const submitRank = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated(CONCEPT.FIELD.RANK)) {
    const rankUpdateValue = updatedValue(CONCEPT.FIELD.RANK)
    const rankUpdate = {
      rankLevel: rankUpdateValue.level,
      rankName: rankUpdateValue.name,
    }
    const params = [concept.name, rankUpdate]
    submitters.push(
      submit(updateConceptRank, params).then(response => ({
        field: CONCEPT.FIELD.RANK,
        action: CONCEPT_STATE.RANK,
        params,
        update: rankUpdate,
        response,
      }))
    )
  }

  return submitters
}

export default submitRank
