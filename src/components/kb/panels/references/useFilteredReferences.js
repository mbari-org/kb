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
const FILTERS = REFERENCES.FILTERS

const useFilteredReferences = () => {
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)
  const { conceptExtent, filters, citationGlob, conceptGlob } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { getConcept } = use(TaxonomyContext)

  const [descendantExtent, setDescendantExtent] = useState({ conceptName: null, names: [] })

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = getSelected(SELECTED_CONCEPT)
  const resolvedFilters = filters || {
    [FILTERS.CITATION]: citationGlob || '',
    [FILTERS.CONCEPT]: '',
    [FILTERS.CONCEPTS]: conceptGlob || '',
  }
  const conceptFilter = byConcept ? resolvedFilters[FILTERS.CONCEPT] || selectedConcept : null

  useEffect(() => {
    if (!conceptFilter || conceptExtent !== EXTENT.DESCENDANTS) return

    let cancelled = false
    const loadDescendants = async () => {
      const descendantNames = await getDescendantNames(apiFns, conceptFilter)
      if (!cancelled) {
        setDescendantExtent({ conceptName: conceptFilter, names: descendantNames })
      }
    }

    loadDescendants().catch(() => {
      if (!cancelled) {
        setDescendantExtent({ conceptName: conceptFilter, names: [] })
      }
    })

    return () => {
      cancelled = true
    }
  }, [apiFns, conceptExtent, conceptFilter])

  const allReferences = getReferences(null)
  let selectedReferences
  switch (conceptExtent) {
    case EXTENT.CHILDREN:
    case EXTENT.DESCENDANTS: {
      if (!conceptFilter) {
        selectedReferences = allReferences
        break
      }
      let extentConceptNames = [conceptFilter]
      if (conceptExtent === EXTENT.CHILDREN) {
        const selectedTaxonomyConcept = getConcept(conceptFilter)
        extentConceptNames = [conceptFilter, ...(selectedTaxonomyConcept?.children || [])]
      } else if (descendantExtent.conceptName === conceptFilter) {
        extentConceptNames = [conceptFilter, ...descendantExtent.names]
      }

      const conceptNameSet = new Set(extentConceptNames)
      selectedReferences = allReferences.filter(reference =>
        reference.concepts?.some(referenceConcept => conceptNameSet.has(referenceConcept))
      )
      break
    }
    default:
      selectedReferences = getReferences(conceptFilter)
  }

  const trimmedCitationGlob = (resolvedFilters[FILTERS.CITATION] || '').toLowerCase()
  const trimmedConceptGlob = (resolvedFilters[FILTERS.CONCEPTS] || '').toLowerCase()

  const filteredReferences = selectedReferences.filter(reference => {
    const citationMatches = reference.citation.toLowerCase().includes(trimmedCitationGlob)
    const conceptMatches =
      !trimmedConceptGlob ||
      reference.concepts?.some(referenceConcept =>
        referenceConcept?.toLowerCase().includes(trimmedConceptGlob)
      )

    return citationMatches && conceptMatches
  })

  return { byConcept, conceptExtent, filteredReferences, selectedConcept: conceptFilter }
}

export default useFilteredReferences
