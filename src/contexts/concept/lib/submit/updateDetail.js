import { updateConceptAuthor, updateConceptRank } from '@/lib/services/oni/api/concept'

const updateDetail = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, updateValue } = updateInfo

  const submitters = []
  if (hasUpdated('author')) {
    const author = updateValue('author')
    submitters.push(submit(updateConceptAuthor, [concept.name, { author }]))
  }

  const rankUpdateValue = field => (hasUpdated(field) ? updateValue(field) : concept[field])

  if (hasUpdated('rankLevel') || hasUpdated('rankName')) {
    // Rank name and level must both be sent, even if only one changes.
    const rankUpdate = {
      rankLevel: rankUpdateValue('rankLevel'),
      rankName: rankUpdateValue('rankName'),
    }
    submitters.push(submit(updateConceptRank, [concept.name, rankUpdate]))
  }

  return submitters
}

export default updateDetail
