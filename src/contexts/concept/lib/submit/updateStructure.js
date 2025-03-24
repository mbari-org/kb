import {
  createConcept,
  updateConceptName,
  updateConceptParent,
} from '@/lib/services/oni/api/concept'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { ASSOCIATED_DATA } = LABELS.CONCEPT.CHANGE_NAME

const updateStructure = ([submit, { concept, updateInfo }]) => {
  const { hasUpdate, updateValue } = updateInfo

  const submitters = []

  if (hasUpdate('name')) {
    submitters.push(submit(updateConceptName, [concept.name, { name: updateValue('name') }]))
  }

  if (hasUpdate('nameChange') && updateValue('nameChange') === ASSOCIATED_DATA) {
    console.log('nameChange', updateValue('nameChange'))
    // submitters.push(submit(updateConceptName, { name: nameChange }))
  }

  if (hasUpdate('parentName')) {
    submitters.push(
      submit(updateConceptParent, [concept.name, { parentName: updateValue('parentName') }])
    )
  }

  if (hasUpdate('children')) {
    updateValue('children').reduce((acc, child) => {
      acc.push(submit(createConcept, { ...child, parentName: concept.name }))
      return acc
    }, submitters)
  }

  return submitters
}

export default updateStructure
