import { use, useCallback, useEffect } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { ReferencesModalProvider } from './modal'
import useUpdateFilters, { EMPTY_FILTERS } from './useUpdateFilters'

import useModifyReferences from './useModifyReferences'
import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

export const ReferencesProvider = ({ children }) => {
  const { setReferences } = use(PanelDataContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const referencesSettings = getSettings(SELECTED.SETTINGS.REFERENCES.KEY) || {}
  const byConcept = referencesSettings[SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]
  const filters = referencesSettings[SELECTED.SETTINGS.REFERENCES.FILTERS.KEY] || EMPTY_FILTERS
  const filterConcept = filters[SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]
  const conceptExtent = filters[SELECTED.SETTINGS.REFERENCES.FILTERS.EXTENT] || CONCEPT.EXTENT.SOLO
  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  useEffect(() => {
    if (!byConcept) return
    if (!selectedConcept) return
    if (filterConcept) return

    updateFilters({ [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: selectedConcept })
  }, [byConcept, filterConcept, selectedConcept, updateFilters])

  const setConceptExtent = useCallback(
    value => {
      updateFilters({ [SELECTED.SETTINGS.REFERENCES.FILTERS.EXTENT]: value })
    },
    [updateFilters]
  )

  const { addReference, editReference, deleteReference } = useModifyReferences({
    setReferences,
  })

  const value = {
    addReference,
    conceptExtent,
    deleteReference,
    editReference,
    filters,
    setConceptExtent,
    updateFilters,
  }

  return (
    <ReferencesContext value={value}>
      <ReferencesModalProvider>{children}</ReferencesModalProvider>
    </ReferencesContext>
  )
}

export default ReferencesProvider
