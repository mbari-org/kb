import { updateConceptRank } from '@/lib/api/concept'

const submitRank = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('rank')) {
    const rankUpdateValue = updatedValue('rank')
    const rankUpdate = {
      rankLevel: rankUpdateValue.level,
      rankName: rankUpdateValue.name,
    }
    submitters.push(submit(updateConceptRank, [concept.name, rankUpdate]))
  }

  return submitters
}

export default submitRank
