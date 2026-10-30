import { use, useCallback } from 'react'

import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { PANEL_DATA } from '@/lib/constants/panelData.js'

const useModifyRealizations = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)

  const editRealization = useCallback(
    async (original, updated) => {
      try {
        await apiFns.apiPayload(updateRealization, [original.id, updated])
        await refreshData(PANEL_DATA.REALIZATIONS)
      } catch (error) {
        throw new Error(`Failed to update realization: ${error.message}`, { cause: error })
      }
    },
    [apiFns, refreshData]
  )

  const deleteRealization = useCallback(
    async realization => {
      try {
        await apiFns.apiPayload(apiDeleteRealization, realization.id)
        await refreshData(PANEL_DATA.REALIZATIONS)
      } catch (error) {
        throw new Error(`Failed to delete realization: ${error.message}`, { cause: error })
      }
    },
    [apiFns, refreshData]
  )

  return { editRealization, deleteRealization }
}

export default useModifyRealizations
