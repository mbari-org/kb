import { addConcept, removeConcept } from '@/lib/kb/api/references'

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

  return {
    ...lastUpdatedReference,
    concepts: (lastUpdatedReference.concepts || []).sort((a, b) => a.localeCompare(b)),
  }
}

export default updateReferenceConcepts
