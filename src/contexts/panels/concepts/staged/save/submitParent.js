import { updateConceptParent } from '@/lib/api/concept'

const submitParent = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('parent')) {
    const parent = updatedValue('parent')
    submitters.push(submit(updateConceptParent, [concept.name, { parentName: parent }]))
  }
  return submitters
}

export default submitParent
