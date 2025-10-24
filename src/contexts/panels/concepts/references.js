import { changeConcept, removeConcept } from '@/lib/kb/api/references'

const updateReferences = async (updatesContext, { conceptName, updatedName }) => {
  const { apiFns, getReferences, refreshPanelData } = updatesContext
  const references = getReferences(conceptName)

  if (references.length > 0) {
    const updatePromises = references.map(reference => {
      if (updatedName) {
        return apiFns.apiPayload(changeConcept, [reference.id, conceptName, updatedName])
      }
      return apiFns.apiPayload(removeConcept, [reference.id, conceptName])
    })
    await Promise.all(updatePromises)
    await refreshPanelData('references')
  }
}

export { updateReferences }
