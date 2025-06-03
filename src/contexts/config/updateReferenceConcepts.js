import { addConcept, removeConcept } from '@/lib/kb/api/references'
import { createReference } from '@/lib/kb/model/reference'
import { isEmpty } from '@/lib/util'

const updateReferenceConcepts = async (oldReference, newReference, apiFns) => {
  const promises = []

  const newConcepts = newReference.concepts || []
  const oldConcepts = oldReference.concepts || []
  const referenceId = oldReference.id

  newConcepts.forEach(concept => {
    if (!oldConcepts.includes(concept)) {
      promises.push(() => apiFns.apiPayload(addConcept, [referenceId, concept]))
    }
  })

  oldConcepts.forEach(concept => {
    if (!newConcepts.includes(concept)) {
      promises.push(() => apiFns.apiPayload(removeConcept, [referenceId, concept]))
    }
  })

  if (isEmpty(promises)) {
    return oldReference
  }

  let lastUpdatedReference
  for (const promiseFn of promises) {
    lastUpdatedReference = await promiseFn()
  }

  return createReference(lastUpdatedReference)
}

export default updateReferenceConcepts
