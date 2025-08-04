import { createConcept } from '@/lib/api/concept'
import { CONCEPT_STATE } from '@/lib/constants'

const { CHILD } = CONCEPT_STATE

const submitChildren = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  const submitters = []
  if (hasUpdated('children')) {
    updatedValue('children').reduce((acc, child) => {
      if (child.action === CHILD.ADD) {
        acc.push(submit(createConcept, { ...child, parentName: concept.name }))
      }
      return acc
    }, submitters)
  }

  return submitters
}

export default submitChildren
