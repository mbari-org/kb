import { updateConceptName } from '@/lib/api/concept'

const submitName = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('name')) {
    const name = updatedValue('name')
    submitters.push(submit(updateConceptName, [concept.name, { name: name.value }]))
  }
  return submitters
}

export default submitName
