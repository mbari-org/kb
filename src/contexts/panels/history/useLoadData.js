import { use, useCallback, useMemo } from 'react'

import { getConceptHistory, getHistoryCount } from '@/lib/kb/api/history'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { sleep } from '@/lib/utils'

import { CONCEPT_EXTENT, CONCEPT_HISTORY, PAGINATION, SELECTED } from '@/lib/constants'

const { TYPE } = CONCEPT_HISTORY
const { CHILDREN, DESCENDANTS } = CONCEPT_EXTENT
const { CONCEPT, SETTINGS } = SELECTED

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT

const useLoadData = ({
  apiFns,
  conceptHistoryExtent,
  pendingHistory,
}) => {
  const { getSelected, getSettings } = use(SelectedContext)
  const { getConcept, getDescendantNames } = use(TaxonomyContext)

  const selectedConcept = getSelected(CONCEPT)
  const selectedType = getSettings(SETTINGS.HISTORY.KEY, SETTINGS.HISTORY.TYPE)

  const conceptChildren = useMemo(() => {
    if (conceptHistoryExtent !== CHILDREN) return []
    const concept = getConcept(selectedConcept)
    return concept?.children || []
  }, [conceptHistoryExtent, getConcept, selectedConcept])

  const loadConceptData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
      updateConceptState({ data, count: data.length })
      updatePageState({ data: data.slice(0, DEFAULT_LIMIT) })
    },
    [apiFns, selectedConcept]
  )

  const loadConceptChildrenData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      const names = [selectedConcept, ...conceptChildren]
      const lists = await Promise.all(names.map(name => apiFns.apiPayload(getConceptHistory, name)))
      const merged = lists.flat()
      updateConceptState({ data: merged, count: merged.length })
      updatePageState({ data: merged.slice(0, DEFAULT_LIMIT) })
    },
    [apiFns, conceptChildren, selectedConcept]
  )

  const loadConceptDescendantsData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      const names = [selectedConcept, ...(await getDescendantNames(selectedConcept))]

      const CONCURRENCY = 8
      const RETRIES = 2
      const isNetworkError = err => {
        if (!err) return false
        if (err.title === 'Network Error') return true
        if (err.message === 'Failed to fetch') return true
        if (err.original && err.original.name === 'TypeError') return true
        return false
      }

      const results = []
      for (let i = 0; i < names.length; i += CONCURRENCY) {
        const batch = names.slice(i, i + CONCURRENCY)
        const batchLists = await Promise.all(
          batch.map(async name => {
            for (let attempt = 0; attempt <= RETRIES; attempt++) {
              const { error, payload } = await apiFns.apiRaw(getConceptHistory, name)
              if (!error) return payload

              if (!isNetworkError(error)) {
                await apiFns.apiPayload(getConceptHistory, name)
                throw error?.original || new Error('History request failed')
              }

              if (attempt < RETRIES) {
                const backoff = 200 * (attempt + 1) + Math.floor(Math.random() * 100)
                await sleep(backoff)
                continue
              }

              await apiFns.apiPayload(getConceptHistory, name)
              throw error?.original || new Error('History request failed after retries')
            }
          })
        )
        results.push(...batchLists)
      }

      const merged = results.flat()
      updateConceptState({ data: merged, count: merged.length })
      updatePageState({ data: merged.slice(0, DEFAULT_LIMIT) })
    },
    [apiFns, getDescendantNames, selectedConcept]
  )

  const loadPendingData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      updateConceptState({ data: pendingHistory, count: pendingHistory.length })
      updatePageState({ data: pendingHistory.slice(0, DEFAULT_LIMIT) })
    },
    [pendingHistory]
  )

  const loadApprovedData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      const result = await apiFns.apiResult(getHistoryCount, selectedType)
      updateConceptState({ data: [], count: result })
      updatePageState({ data: [] })
    },
    [apiFns, selectedType]
  )

  const loadData = useCallback(
    async ({ updateConceptState, updatePageState }) => {
      if (!apiFns) return

      updatePageState({ limit: DEFAULT_LIMIT, offset: 0 })

      if (selectedType === TYPE.CONCEPT) {
        if (conceptHistoryExtent === CHILDREN) {
          return loadConceptChildrenData({ updateConceptState, updatePageState })
        }

        if (conceptHistoryExtent === DESCENDANTS) {
          return loadConceptDescendantsData({ updateConceptState, updatePageState })
        }
        return loadConceptData({ updateConceptState, updatePageState })
      }

      if (selectedType === TYPE.PENDING) {
        return loadPendingData({ updateConceptState, updatePageState })
      }

      return loadApprovedData({ updateConceptState, updatePageState })
    },
    [
      apiFns,
      conceptHistoryExtent,
      loadApprovedData,
      loadConceptChildrenData,
      loadConceptData,
      loadConceptDescendantsData,
      loadPendingData,
      selectedType,
    ]
  )

  return loadData
}

export default useLoadData
