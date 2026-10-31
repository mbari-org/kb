import { use, useCallback } from 'react'

import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'
import { sortRealizations } from '@/lib/model/realization'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import debugSync from '@/debugSync'

const useModifyRealizations = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { conceptEditsRefresh, getConcept: getTaxonomyConcept, taxonomy } = use(TaxonomyContext)
  const { isAdmin } = use(UserContext)

  // The server caches concepts, so a refetch can return stale realizations right after a
  // realization write. Apply the known change to the taxonomy concept in-situ instead.
  const applyRealizationsUpdate = useCallback(
    async (conceptName, applyUpdate) => {
      const staleConcept = getTaxonomyConcept(conceptName)
      const conceptMapKeys = taxonomy?.conceptMap ? Object.keys(taxonomy.conceptMap) : null
      debugSync('[KBSYNC] applyRealizationsUpdate', conceptName, 'staleConcept:', staleConcept?.name, 'mapSize:', conceptMapKeys?.length, 'hasKey:', conceptMapKeys?.includes(conceptName), 'sampleKeys:', JSON.stringify(conceptMapKeys?.slice(-8)))
      if (!staleConcept) return

      const freshConcept = {
        ...staleConcept,
        realizations: sortRealizations([...applyUpdate(staleConcept.realizations)]),
      }
      debugSync('[KBSYNC] freshConcept realizations:', JSON.stringify(freshConcept.realizations))

      await conceptEditsRefresh(freshConcept, staleConcept)
      debugSync('[KBSYNC] conceptEditsRefresh done', conceptName)
    },
    [conceptEditsRefresh, getTaxonomyConcept, taxonomy]
  )

  const editRealization = useCallback(
    async (original, updated) => {
      debugSync('[KBSYNC] editRealization ENTER', JSON.stringify(original), JSON.stringify(updated))
      try {
        await apiFns.apiPayload(updateRealization, [original.id, updated])
        await Promise.all([refreshData(PANEL_DATA.REALIZATIONS), refreshData(PANEL_DATA.PENDING_HISTORY)])
      } catch (error) {
        debugSync('[KBSYNC] editRealization THREW', error?.message)
        throw new Error(`Failed to update realization: ${error.message}`, { cause: error })
      }
      debugSync('[KBSYNC] editRealization past try')
      await applyRealizationsUpdate(original.concept, realizations =>
        realizations.map(realization => (realization.id === original.id ? { ...realization, ...updated } : realization))
      )
    },
    [apiFns, applyRealizationsUpdate, refreshData]
  )

  const deleteRealization = useCallback(
    async realization => {
      try {
        await apiFns.apiPayload(apiDeleteRealization, realization.id)
        await Promise.all([refreshData(PANEL_DATA.REALIZATIONS), refreshData(PANEL_DATA.PENDING_HISTORY)])
      } catch (error) {
        throw new Error(`Failed to delete realization: ${error.message}`, { cause: error })
      }
      // A non-admin delete only creates a pending item server-side; keep the realization so the
      // concept display can mark it pending.
      await applyRealizationsUpdate(realization.concept, realizations =>
        isAdmin ? realizations.filter(item => item.id !== realization.id) : realizations
      )
    },
    [apiFns, applyRealizationsUpdate, isAdmin, refreshData]
  )

  return { editRealization, deleteRealization }
}

export default useModifyRealizations
