import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'
import { getDescendantNames } from '@/lib/model/concept'

const { CONCEPT: SELECTED_CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS
const { EXTENT } = CONCEPT

const useFilteredReferences = () => {
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)
  const { citationGlob, conceptExtent } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { getConcept } = use(TaxonomyContext)

  const [descendantExtent, setDescendantExtent] = useState({ conceptName: null, names: [] })

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(SELECTED_CONCEPT) : null

  useEffect(() => {
    if (!selectedConcept || conceptExtent !== EXTENT.DESCENDANTS) return

    let cancelled = false
    const loadDescendants = async () => {
      const descendantNames = await getDescendantNames(apiFns, selectedConcept)
      if (!cancelled) {
        setDescendantExtent({ conceptName: selectedConcept, names: descendantNames })
      }
    }

    loadDescendants().catch(() => {
      if (!cancelled) {
        setDescendantExtent({ conceptName: selectedConcept, names: [] })
      }
    })

    return () => {
      cancelled = true
    }
  }, [apiFns, conceptExtent, selectedConcept])

  const allReferences = getReferences(null)
  let selectedReferences
  switch (conceptExtent) {
    case EXTENT.CHILDREN:
    case EXTENT.DESCENDANTS: {
      if (!selectedConcept) {
        selectedReferences = allReferences
        break
      }

      let extentConceptNames = [selectedConcept]
      if (conceptExtent === EXTENT.CHILDREN) {
        const selectedTaxonomyConcept = getConcept(selectedConcept)
        extentConceptNames = [selectedConcept, ...(selectedTaxonomyConcept?.children || [])]
      } else if (descendantExtent.conceptName === selectedConcept) {
        extentConceptNames = [selectedConcept, ...descendantExtent.names]
      }

      const conceptNameSet = new Set(extentConceptNames)
      selectedReferences = allReferences.filter(reference =>
        reference.concepts?.some(referenceConcept => conceptNameSet.has(referenceConcept))
      )
      break
    }
    default:
      selectedReferences = getReferences(selectedConcept)
  }

  const filteredReferences = selectedReferences.filter(reference =>
    reference.citation.toLowerCase().includes((citationGlob || '').toLowerCase())
  )

  return { byConcept, conceptExtent, filteredReferences, selectedConcept }
}

export default useFilteredReferences
