import { use, useCallback } from 'react'

import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'
import { getConcept, normalizeConcept } from '@/lib/api/concept'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PANEL_DATA } from '@/lib/constants/panelData.js'

const useModifyRealizations = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { conceptEditsRefresh, getConcept: getTaxonomyConcept } = use(TaxonomyContext)

  const refreshTaxonomyConcept = useCallback(
    async conceptName => {
      const staleConcept = getTaxonomyConcept(conceptName)
      if (!staleConcept) return

      const freshConcept = await apiFns.apiPayload(getConcept, conceptName)
      await normalizeConcept(apiFns, freshConcept)

      freshConcept.aliases = (staleConcept.aliases || []).map(alias => ({ ...alias }))
      freshConcept.alternateNames = [...(staleConcept.alternateNames || [])]
      freshConcept.children = [...(staleConcept.children || [])]
      freshConcept.parent = staleConcept.parent

      await conceptEditsRefresh(freshConcept, staleConcept)
    },
    [apiFns, conceptEditsRefresh, getTaxonomyConcept]
  )

  const editRealization = useCallback(
    async (original, updated) => {
      try {
        await apiFns.apiPayload(updateRealization, [original.id, updated])
        await refreshData(PANEL_DATA.REALIZATIONS)
      } catch (error) {
        throw new Error(`Failed to update realization: ${error.message}`, { cause: error })
      }
      await refreshTaxonomyConcept(original.concept)
    },
    [apiFns, refreshData, refreshTaxonomyConcept]
  )

  const deleteRealization = useCallback(
    async realization => {
      try {
        await apiFns.apiPayload(apiDeleteRealization, realization.id)
        await refreshData(PANEL_DATA.REALIZATIONS)
      } catch (error) {
        throw new Error(`Failed to delete realization: ${error.message}`, { cause: error })
      }
      await refreshTaxonomyConcept(realization.concept)
    },
    [apiFns, refreshData, refreshTaxonomyConcept]
  )

  return { editRealization, deleteRealization }
}

export default useModifyRealizations
