import { addConcept, removeConcept } from '@/lib/kb/api/references'

import { PANEL_DATA } from '@/lib/constants/panelData.js'

const updateReferences = async (updatesContext, { conceptName, updatedName }) => {
  const { apiFns, getReferences, refreshPanelData } = updatesContext
  const references = getReferences(conceptName)

  if (references.length > 0) {
    const updatePromises = references.map(reference => {
      if (updatedName) {
        return apiFns.apiPayload(addConcept, [reference.id, conceptName, updatedName])
      }
      return apiFns.apiPayload(removeConcept, [reference.id, conceptName])
    })
    await Promise.all(updatePromises)
    await refreshPanelData(PANEL_DATA.REFERENCES)
  }
}

export { updateReferences }
