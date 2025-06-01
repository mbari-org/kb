import { addConcept, getReference, removeConcept } from '@/lib/kb/api/references'

import { isEmpty } from '@/lib/util'

const updateReferenceConcepts = async (oldReference, newReference, apiFns) => {
  const promises = []

  const newConcepts = newReference.concepts || []
  const oldConcepts = oldReference.concepts || []
  const referenceId = oldReference.id

  newConcepts.forEach(concept => {
    if (!oldConcepts.includes(concept)) {
      promises.push(apiFns.apiResult(addConcept, [referenceId, concept]))
    }
  })

  oldConcepts.forEach(concept => {
    if (!newConcepts.includes(concept)) {
      promises.push(apiFns.apiResult(removeConcept, [referenceId, concept]))
    }
  })

  if (isEmpty(promises)) {
    return oldReference
  }

  for (const promise of promises) {
    await promise
  }
  return apiFns.apiPayload(getReference, referenceId)
}

export default updateReferenceConcepts
