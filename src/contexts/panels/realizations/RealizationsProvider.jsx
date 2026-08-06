import { use, useEffect, useMemo, useCallback } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { DEFAULT_FILTERS } from '@/contexts/panels/realizations/constants'
import useUpdateFilters from '@/contexts/panels/realizations/useUpdateFilters'
import { SELECTED } from '@/lib/constants/selected.js'
import { PANEL_DATA } from '@/lib/constants/panelData.js'

const { REALIZATIONS } = SELECTED.SETTINGS
const FILTERS = REALIZATIONS.FILTERS

const RealizationsProvider = ({ children }) => {
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const { realizations, refreshData } = use(PanelDataContext)

  const realizationsSettings = getSettings(REALIZATIONS.KEY) || {}
  const filters = realizationsSettings[FILTERS.KEY] || DEFAULT_FILTERS

  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isRealizationsPanelSelected = selectedPanel === SELECTED.PANELS.REALIZATIONS
  const isInitialConceptFilterPending =
    isRealizationsPanelSelected && typeof filters[FILTERS.CONCEPT] === 'undefined' && Boolean(selectedConcept)

  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  useEffect(() => {
    if (!isRealizationsPanelSelected) return
    if (realizations.length > 0) return
    refreshData(PANEL_DATA.REALIZATIONS)
  }, [realizations.length, isRealizationsPanelSelected, refreshData])

  const explicitConcepts = useMemo(() => {
    if (realizations.length === 0) {
      return []
    }
    const uniqueConcepts = new Set()
    realizations.forEach(realization => {
      if (realization.concept) {
        uniqueConcepts.add(realization.concept)
      }
    })
    return Array.from(uniqueConcepts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }, [realizations])

  const filteredRealizations = useMemo(() => {
    if (realizations.length === 0) {
      return []
    }
    if (isInitialConceptFilterPending) {
      return []
    }

    const concept = filters[FILTERS.CONCEPT]
    const toConcept = filters[FILTERS.TO_CONCEPT]
    const trimmedLinkName = filters[FILTERS.LINK_NAME]?.trim().toLowerCase()
    const trimmedLinkValue = filters[FILTERS.LINK_VALUE]?.trim().toLowerCase()

    return realizations.filter(realization => {
      if (concept && realization.concept && realization.concept !== concept) {
        return false
      }
      if (toConcept && realization.toConcept && realization.toConcept !== toConcept) {
        return false
      }
      if (trimmedLinkName && !realization.linkName?.toLowerCase().includes(trimmedLinkName)) {
        return false
      }
      if (trimmedLinkValue && !realization.linkValue?.toLowerCase().includes(trimmedLinkValue)) {
        return false
      }
      return true
    })
  }, [realizations, filters, isInitialConceptFilterPending])

  const filterString = useCallback(realization => {
    if (!realization) return '* | * | * | *'

    const concept = realization.concept || '*'
    const linkName = realization.linkName || '*'
    const toConcept = realization.toConcept || '*'
    const linkValue = realization.linkValue || '*'

    return `${concept} | ${linkName} | ${toConcept} | ${linkValue}`
  }, [])

  const value = useMemo(
    () => ({
      explicitConcepts,
      filteredRealizations,
      filters,
      filterString,
      realizations: realizations,
      updateFilters,
    }),
    [realizations, explicitConcepts, filteredRealizations, filters, filterString, updateFilters]
  )

  return <RealizationsContext value={value}>{children}</RealizationsContext>
}

export default RealizationsProvider
