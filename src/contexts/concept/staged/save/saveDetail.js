import { updateConceptAuthor, updateConceptRank } from '@/lib/api/concept'

const saveDetail = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, updatedValue } = updateInfo

  const submitters = []
  if (hasUpdated('author')) {
    const author = updatedValue('author')
    submitters.push(submit(updateConceptAuthor, [concept.name, { author }]))
  }

  const rankUpdateValue = field => (hasUpdated(field) ? updatedValue(field) : concept[field])

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

export default saveDetail
