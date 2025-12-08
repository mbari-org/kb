import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptName } from '@/lib/api/concept'

const submitName = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('name')) {
    const name = updatedValue('name')
    const params = [concept.name, { name: name.value }]
    submitters.push(
      submit(updateConceptName, params).then(response => ({
        action: CONCEPT_STATE.NAME,
        field: 'name',
        params,
        response,
        update: name,
      }))
    )
  }
  return submitters
}

export default submitName
