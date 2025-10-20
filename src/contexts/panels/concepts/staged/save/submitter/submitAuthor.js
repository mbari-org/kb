import { CONCEPT_STATE } from '@/lib/constants'
import { updateConceptAuthor } from '@/lib/kb/api/concept'

const submitAuthor = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('author')) {
    const author = updatedValue('author')?.value ?? updatedValue('author')
    const params = [concept.name, { author }]
    submitters.push(
      submit(updateConceptAuthor, params).then(response => ({
        field: 'author',
        action: CONCEPT_STATE.AUTHOR,
        params,
        update: { author },
        response,
      }))
    )
  }
  return submitters
}

export default submitAuthor
