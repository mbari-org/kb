import { updateConceptAuthor } from '@/lib/api/concept'

const submitAuthor = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('author')) {
    const author = updatedValue('author')
    submitters.push(submit(updateConceptAuthor, [concept.name, { author }]))
  }
  return submitters
}

export default submitAuthor
