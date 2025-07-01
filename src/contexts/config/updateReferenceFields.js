import { updateReference } from '@/lib/api/references'

import { isEmpty } from '@/lib/utils'

const updateReferenceFields = async (oldReference, newReference, apiFns) => {
  if (newReference.id !== oldReference.id) {
    throw new Error('Attempting edit reference with different IDs')
  }
  const referenceId = oldReference.id

  const updatedData = {}
  if (newReference.citation !== oldReference.citation) {
    updatedData.citation = newReference.citation
  }

  if (newReference.doi !== oldReference.doi) {
    updatedData.doi = newReference.doi
  }

  return !isEmpty(updatedData)
    ? apiFns.apiPayload(updateReference, [referenceId, updatedData])
    : oldReference
}

export default updateReferenceFields
