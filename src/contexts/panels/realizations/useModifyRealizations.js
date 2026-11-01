import { use, useCallback } from 'react'

import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { PANEL_DATA } from '@/lib/constants/panelData.js'

const useModifyRealizations = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData, reloadConceptRealizations } = use(PanelDataContext)

  const editRealization = useCallback(
    async (original, updated) => {
      try {
        await apiFns.apiPayload(updateRealization, [original.id, updated])
        await Promise.all([reloadConceptRealizations(original.concept), refreshData(PANEL_DATA.PENDING_HISTORY)])
      } catch (error) {
        throw new Error(`Failed to update realization: ${error.message}`, { cause: error })
      }
    },
    [apiFns, refreshData, reloadConceptRealizations]
  )

  const deleteRealization = useCallback(
    async realization => {
      try {
        await apiFns.apiPayload(apiDeleteRealization, realization.id)
        await Promise.all([reloadConceptRealizations(realization.concept), refreshData(PANEL_DATA.PENDING_HISTORY)])
      } catch (error) {
        throw new Error(`Failed to delete realization: ${error.message}`, { cause: error })
      }
    },
    [apiFns, refreshData, reloadConceptRealizations]
  )

  return { editRealization, deleteRealization }
}

export default useModifyRealizations
