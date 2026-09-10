import { use, useEffect, useMemo, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import dataFilters from '@/contexts/panels/dataFilters'
import useUpdateFilters from '@/contexts/panels/useUpdateFilters'
import useLoadRealizations from '@/contexts/panel/data/useLoadRealizations'
import { SELECTED } from '@/lib/constants/selected.js'
import { PANEL_DATA } from '@/lib/constants/panelData.js'

const { REALIZATIONS } = SELECTED.SETTINGS
const FILTERS = REALIZATIONS.FILTERS
const { DEFAULT_FILTERS } = dataFilters(REALIZATIONS.KEY)

const RealizationsProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { getSelected } = use(SelectedContext)
  const { getSettings, updateSettings } = use(SelectedSettingsContext)
  const { realizations, refreshData } = use(PanelDataContext)
  const loadRealizations = useLoadRealizations(apiFns)

  const realizationsSettings = getSettings(REALIZATIONS.KEY) || {}
  const filters = realizationsSettings[FILTERS.KEY] || DEFAULT_FILTERS
  const conceptFilter = filters[FILTERS.CONCEPT]

  const [conceptRealizations, setConceptRealizations] = useState(null)

  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isRealizationsPanelSelected = selectedPanel === SELECTED.PANELS.REALIZATIONS
  const isInitialConceptFilterPending =
    isRealizationsPanelSelected && typeof conceptFilter === 'undefined' && Boolean(selectedConcept)

  const { updateFilters } = useUpdateFilters(REALIZATIONS.KEY, updateSettings)

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  useEffect(() => {
    if (!isRealizationsPanelSelected) return
    if (isInitialConceptFilterPending) return

    if (conceptFilter) {
      let stale = false
      loadRealizations(conceptFilter).then(loaded => {
        if (!stale) setConceptRealizations({ concept: conceptFilter, data: loaded })
      })
      return () => {
        stale = true
      }
    }

    if (realizations.length === 0) {
      refreshData(PANEL_DATA.REALIZATIONS)
    }
  }, [conceptFilter, isInitialConceptFilterPending, isRealizationsPanelSelected, loadRealizations, realizations, refreshData])

  const explicitToConcepts = useMemo(() => {
    if (realizations.length === 0) {
      return []
    }
    const uniqueToConcepts = new Set()
    realizations.forEach(realization => {
      if (realization.toConcept) {
        uniqueToConcepts.add(realization.toConcept)
      }
    })

    return Array.from(uniqueToConcepts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }, [realizations])

  const filteredRealizations = useMemo(() => {
    if (isInitialConceptFilterPending) {
      return []
    }

    const sourceRealizations =
      conceptFilter && conceptRealizations?.concept === conceptFilter ? conceptRealizations.data : realizations

    const concept = filters[FILTERS.CONCEPT]
    const toConcept = filters[FILTERS.TO_CONCEPT]
    const trimmedLinkName = filters[FILTERS.LINK_NAME]?.trim().toLowerCase()
    const trimmedLinkValue = filters[FILTERS.LINK_VALUE]?.trim().toLowerCase()

    return sourceRealizations.filter(realization => {
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
  }, [conceptFilter, conceptRealizations, realizations, filters, isInitialConceptFilterPending])

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
      explicitToConcepts,
      filteredRealizations,
      filters,
      filterString,
      realizations: realizations,
      updateFilters,
    }),
    [explicitToConcepts, filteredRealizations, filters, filterString, realizations, updateFilters]
  )

  return <RealizationsContext value={value}>{children}</RealizationsContext>
}

export default RealizationsProvider
