import { createConcept, updateConceptName, updateConceptParent } from '@/lib/kb/api/concept'

import { LABELS } from '@/lib/constants'

const { ASSOCIATED_DATA } = LABELS.CONCEPT.CHANGE_NAME

const saveStructure = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, updatedValue } = updateInfo

  const submitters = []

  if (hasUpdated('name')) {
    submitters.push(submit(updateConceptName, [concept.name, { name: updatedValue('name') }]))
  }

  if (updatedValue('nameChange') === ASSOCIATED_DATA) {
    console.log('CxInc nameChange of associated data', updatedValue('nameChange'))
    // submitters.push(submit(updateConceptName, { name: nameChange }))
  }

  if (hasUpdated('parent')) {
    submitters.push(
      submit(updateConceptParent, [concept.name, { parentName: updatedValue('parent') }])
    )
  }

  if (hasUpdated('children')) {
    updatedValue('children').reduce((acc, child) => {
      acc.push(submit(createConcept, { ...child, parentName: concept.name }))
      return acc
    }, submitters)
  }

  return submitters
}

export default saveStructure
