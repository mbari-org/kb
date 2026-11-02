import { use, useEffect, useMemo, useCallback } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import { RealizationsModalProvider } from '@/contexts/panels/realizations/modal'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import dataFilters from '@/contexts/panels/dataFilters'
import useUpdateFilters from '@/contexts/panels/useUpdateFilters'
import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { SELECTED } from '@/lib/constants/selected.js'
import { matchingRealizationString } from '@/lib/model/realization'

const { REALIZATIONS } = SELECTED.SETTINGS
const FILTERS = REALIZATIONS.FILTERS
const { DEFAULT_FILTERS } = dataFilters(REALIZATIONS.KEY)

const RealizationsProvider = ({ children }) => {
  const { getSelected } = use(SelectedContext)
  const { getSettings, updateSettings } = use(SelectedSettingsContext)
  const {
    ensureAllRealizations,
    ensureConceptRealizations,
    getAllRealizations,
    getConceptRealizations,
    pendingHistory,
  } = use(PanelDataContext)

  const { editRealization, deleteRealization } = useModifyRealizations()

  const realizationsSettings = getSettings(REALIZATIONS.KEY) || {}
  const filters = realizationsSettings[FILTERS.KEY] || DEFAULT_FILTERS
  const conceptFilter = filters[FILTERS.CONCEPT]

  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isRealizationsPanelSelected = selectedPanel === SELECTED.PANELS.REALIZATIONS
  const isInitialConceptFilterPending =
    isRealizationsPanelSelected && typeof conceptFilter === 'undefined' && Boolean(selectedConcept)

  const { updateFilters } = useUpdateFilters(REALIZATIONS.KEY, updateSettings)

  const getPendingRealizationItem = useCallback(
    realization =>
      pendingHistory.find(
        item =>
          item.field === HISTORY_FIELD.REALIZATION &&
          item.concept === realization.concept &&
          matchingRealizationString(realization, item.action === ACTION.DELETE ? item.oldValue : item.newValue)
      ) ?? null,
    [pendingHistory]
  )

  const getPendingRealizationAction = useCallback(
    realization => getPendingRealizationItem(realization)?.action ?? null,
    [getPendingRealizationItem]
  )

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  useEffect(() => {
    if (!isRealizationsPanelSelected) return
    if (isInitialConceptFilterPending) return

    if (conceptFilter) {
      ensureConceptRealizations(conceptFilter)
      return
    }
    ensureAllRealizations()
  }, [conceptFilter, ensureAllRealizations, ensureConceptRealizations, isInitialConceptFilterPending, isRealizationsPanelSelected])

  const sourceRealizations = useMemo(
    () => (conceptFilter ? (getConceptRealizations(conceptFilter) ?? []) : getAllRealizations()),
    [conceptFilter, getAllRealizations, getConceptRealizations]
  )

  const explicitToConcepts = useMemo(() => {
    const uniqueToConcepts = new Set()
    getAllRealizations().forEach(realization => {
      if (realization.toConcept) {
        uniqueToConcepts.add(realization.toConcept)
      }
    })

    return Array.from(uniqueToConcepts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }, [getAllRealizations])

  const filteredRealizations = useMemo(() => {
    if (isInitialConceptFilterPending) {
      return []
    }

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
  }, [filters, isInitialConceptFilterPending, sourceRealizations])

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
      deleteRealization,
      editRealization,
      explicitToConcepts,
      filteredRealizations,
      filters,
      filterString,
      getPendingRealizationAction,
      getPendingRealizationItem,
      updateFilters,
    }),
    [
      deleteRealization,
      editRealization,
      explicitToConcepts,
      filteredRealizations,
      filters,
      filterString,
      getPendingRealizationAction,
      getPendingRealizationItem,
      updateFilters,
    ]
  )

  return (
    <RealizationsContext value={value}>
      <RealizationsModalProvider>{children}</RealizationsModalProvider>
    </RealizationsContext>
  )
}

export default RealizationsProvider
