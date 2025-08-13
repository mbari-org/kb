import { updateConceptRank } from '@/lib/api/concept'
import { CONCEPT_STATE } from '@/lib/constants'

const submitRank = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('rank')) {
    const rankUpdateValue = updatedValue('rank')
    const rankUpdate = {
      rankLevel: rankUpdateValue.level,
      rankName: rankUpdateValue.name,
    }
    const params = [concept.name, rankUpdate]
    submitters.push(
      submit(updateConceptRank, params).then(response => ({
        field: 'rank',
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
