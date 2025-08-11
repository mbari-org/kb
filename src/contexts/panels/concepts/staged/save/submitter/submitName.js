import { updateConceptName } from '@/lib/api/concept'
import { CONCEPT_STATE } from '@/lib/constants'

const submitName = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('name')) {
    const name = updatedValue('name')
    const params = [concept.name, { name: name.value }]
    submitters.push(
      submit(updateConceptName, params).then(response => ({
        field: 'name',
        action: CONCEPT_STATE.NAME,
        params,
        update: name,
        response,
      }))
    )
  }
  return submitters
}

export default submitName
