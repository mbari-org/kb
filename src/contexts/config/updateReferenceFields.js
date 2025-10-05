import { updateReference } from '@/lib/api/references'
import { createError } from '@/lib/errors'
import { isEmpty, isJsonEqual } from '@/lib/utils'

const updateReferenceFields = async (oldReference, newReference, apiFns) => {
  if (newReference.id !== oldReference.id) {
    throw createError(
      'Reference Edit Error',
      'Cannot edit reference with mismatched IDs',
      { oldId: oldReference.id, newId: newReference.id }
    )
  }
  const referenceId = oldReference.id

  const updatedData = {}
  if (newReference.citation !== oldReference.citation) {
    updatedData.citation = newReference.citation
  }

  if (newReference.doi !== oldReference.doi) {
    updatedData.doi = newReference.doi
  }

  if (!isJsonEqual(newReference.concepts, oldReference.concepts)) {
    updatedData.concepts = newReference.concepts
  }

  return !isEmpty(updatedData)
    ? apiFns.apiPayload(updateReference, [referenceId, updatedData])
    : oldReference
}

export default updateReferenceFields
