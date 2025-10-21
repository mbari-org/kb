import { use, useCallback } from 'react'

import { changeConcept } from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

const useSideEffects = ({ staleConcept, updatesInfo }) => {
  const { apiFns } = use(ConfigContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)

  const hasUpdatedName = updatesInfo?.hasUpdated('name')
  const conceptName = hasUpdatedName ? updatesInfo.updatedValue('name').value : staleConcept.name

  const updateReferences = useCallback(async () => {
    if (hasUpdatedName) {
      const references = getReferences(staleConcept.name)
      await Promise.all(
        references.map(reference =>
          apiFns.apiPayload(
            changeConcept,
            [reference.id, staleConcept.name, conceptName]
          )
        )
      )
      await refreshPanelData('references')
    }
  }, [apiFns, conceptName, getReferences, hasUpdatedName, refreshPanelData, staleConcept.name])

  const runSideEffects = useCallback(async () => {
    await updateReferences()
  }, [updateReferences])

  return { conceptName, runSideEffects }
}

export default useSideEffects