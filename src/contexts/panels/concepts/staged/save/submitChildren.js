import { createConcept } from '@/lib/api/concept'

const submitChildren = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('children')) {
    updatedValue('children').reduce((acc, child) => {
      acc.push(submit(createConcept, { ...child, parentName: concept.name }))
      return acc
    }, submitters)
  }

  return submitters
}

export default submitChildren
