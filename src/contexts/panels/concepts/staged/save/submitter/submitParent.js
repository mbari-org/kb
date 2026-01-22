import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptParent } from '@/lib/api/concept'

const submitParent = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated(CONCEPT.FIELD.PARENT)) {
    const parent =
      updatedValue(CONCEPT.FIELD.PARENT)?.value ?? updatedValue(CONCEPT.FIELD.PARENT)
    const params = [concept.name, { parentName: parent }]
    submitters.push(
      submit(updateConceptParent, params).then(response => ({
        field: CONCEPT.FIELD.PARENT,
        action: CONCEPT_STATE.PARENT,
        params,
        update: { parentName: parent },
        response,
      }))
    )
  }
  return submitters
}

export default submitParent
