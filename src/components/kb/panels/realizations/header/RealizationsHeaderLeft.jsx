import { use, useEffect } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptNavAuxiliary from '@/components/common/concept/ConceptNavAuxiliary'

import SelectedContext from '@/contexts/selected/SelectedContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'

import { SELECTED } from '@/lib/constants/selected.js'
const { CONCEPT, PANEL } = SELECTED
const { REALIZATIONS } = SELECTED.SETTINGS
const { FILTERS } = REALIZATIONS

const RealizationsHeaderLeft = () => {
  const { concepts, getSelected, updateSelected } = use(SelectedContext)
  const { explicitConcepts, filters, updateFilters } = use(RealizationsContext)
  const selectedConcept = getSelected(CONCEPT)
  const selectedPanel = getSelected(PANEL)
  const filterConcept = filters[FILTERS.CONCEPT]
  const selectables = explicitConcepts.length > 0 ? explicitConcepts : undefined

  useEffect(() => {
    const isRealizationsPanel = selectedPanel === SELECTED.PANELS.REALIZATIONS
    if (filterConcept === '' && isRealizationsPanel) return
    if (selectedConcept && selectedConcept !== filterConcept) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [filterConcept, selectedConcept, selectedPanel, updateFilters])

  const handleConceptSelected = conceptName => {
    if (conceptName) {
      updateSelected({ [SELECTED.CONCEPT]: conceptName })
      updateFilters({ [FILTERS.CONCEPT]: conceptName })
      return
    }
    updateSelected({ [SELECTED.CONCEPT]: null })
    updateFilters({ [FILTERS.CONCEPT]: '' })
  }

  return (
    <ConceptSelect
      auxiliaryComponent={<ConceptNavAuxiliary concepts={concepts} />}
      conceptName={filterConcept}
      doConceptSelected={handleConceptSelected}
      selectables={selectables}
      updateConceptSelected={true}
    />
  )
}

export default RealizationsHeaderLeft