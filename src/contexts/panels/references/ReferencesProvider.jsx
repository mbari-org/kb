import { use, useCallback, useEffect } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { ReferencesModalProvider } from './modal'
import dataFilters from '@/contexts/panels/dataFilters'
import useUpdateFilters from '@/contexts/panels/useUpdateFilters'

import useModifyReferences from './useModifyReferences'
import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS
const { DEFAULT_FILTERS } = dataFilters(REFERENCES.KEY)

export const ReferencesProvider = ({ children }) => {
  const { setReferences } = use(PanelDataContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isReferencesPanelSelected = selectedPanel === SELECTED.PANELS.REFERENCES
  const referencesSettings = getSettings(REFERENCES.KEY) || {}
  const filters = referencesSettings[REFERENCES.FILTERS.KEY] || DEFAULT_FILTERS
  const filterConcept = filters[REFERENCES.FILTERS.CONCEPT]
  const conceptExtent = filters[REFERENCES.FILTERS.EXTENT] || CONCEPT.EXTENT.SOLO
  const isInitialConceptFilterPending =
    isReferencesPanelSelected && typeof filterConcept === 'undefined' && Boolean(selectedConcept)
  const { updateFilters } = useUpdateFilters(REFERENCES.KEY, updateSettings)

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [REFERENCES.FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  const setConceptExtent = useCallback(
    value => {
      updateFilters({ [REFERENCES.FILTERS.EXTENT]: value })
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
