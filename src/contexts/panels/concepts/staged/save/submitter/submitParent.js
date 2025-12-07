import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'
import { updateConceptParent } from '@/lib/kb/api/concept'

const submitParent = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('parent')) {
    const parent = updatedValue('parent')?.value ?? updatedValue('parent')
    const params = [concept.name, { parentName: parent }]
    submitters.push(
      submit(updateConceptParent, params).then(response => ({
        field: 'parent',
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
