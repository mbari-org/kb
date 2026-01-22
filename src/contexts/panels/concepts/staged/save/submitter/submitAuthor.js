import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptAuthor } from '@/lib/api/concept'

const submitAuthor = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated(CONCEPT.FIELD.AUTHOR)) {
    const author =
      updatedValue(CONCEPT.FIELD.AUTHOR)?.value ?? updatedValue(CONCEPT.FIELD.AUTHOR)
    const params = [concept.name, { author }]
    submitters.push(
      submit(updateConceptAuthor, params).then(response => ({
        field: CONCEPT.FIELD.AUTHOR,
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
