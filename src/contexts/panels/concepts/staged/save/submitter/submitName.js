import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptName } from '@/lib/api/concept'

const submitName = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated(CONCEPT.FIELD.NAME)) {
    const name = updatedValue(CONCEPT.FIELD.NAME)
    const params = [concept.name, { name: name.value }]
    submitters.push(
      submit(updateConceptName, params).then(response => ({
        action: CONCEPT_STATE.NAME,
        field: CONCEPT.FIELD.NAME,
        params,
        response,
        update: name,
      }))
    )
  }
  return submitters
}

export default submitName
