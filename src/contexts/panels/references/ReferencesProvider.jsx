import { use, useCallback, useEffect } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { ReferencesModalProvider } from './modal'
import useUpdateFilters from './useUpdateFilters'

import useModifyReferences from './useModifyReferences'
import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

const DEFAULT_FILTERS = {
  [SELECTED.SETTINGS.REFERENCES.FILTERS.CITATION]: '',
  [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPTS]: '',
  [SELECTED.SETTINGS.REFERENCES.FILTERS.EXTENT]: CONCEPT.EXTENT.SOLO,
}

export const ReferencesProvider = ({ children }) => {
  const { setReferences } = use(PanelDataContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isReferencesPanelSelected = selectedPanel === SELECTED.PANELS.REFERENCES
  const referencesSettings = getSettings(SELECTED.SETTINGS.REFERENCES.KEY) || {}
  const filters = referencesSettings[SELECTED.SETTINGS.REFERENCES.FILTERS.KEY] || DEFAULT_FILTERS
  const filterConcept = filters[SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]
  const conceptExtent = filters[SELECTED.SETTINGS.REFERENCES.FILTERS.EXTENT] || CONCEPT.EXTENT.SOLO
  const isInitialConceptFilterPending =
    isReferencesPanelSelected && typeof filterConcept === 'undefined' && Boolean(selectedConcept)
  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

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
