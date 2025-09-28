import { use, useCallback, useMemo } from 'react'

import { getConceptHistory, getHistoryCount } from '@/lib/api/history'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { sleep } from '@/lib/utils'

import { CONCEPT_EXTENT, CONCEPT_HISTORY, PAGINATION } from '@/lib/constants'

const { TYPE } = CONCEPT_HISTORY
const { CHILDREN, DESCENDANTS } = CONCEPT_EXTENT

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT

const useLoadData = ({
  apiFns,
  conceptHistoryExtent,
  pendingHistory,
  selectedConcept,
  selectedType,
}) => {
  const { getConcept, getDescendantNames } = use(TaxonomyContext)

  const conceptChildren = useMemo(() => {
    if (!selectedConcept || conceptHistoryExtent !== CHILDREN) return []
    const concept = getConcept(selectedConcept)
    return concept?.children || []
  }, [conceptHistoryExtent, getConcept, selectedConcept])

  const loadConceptData = useCallback(
    async ({ setCount, setConceptData, setTypeData }) => {
      const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
      setCount(data.length)
      setConceptData(data)
      setTypeData(data.slice(0, DEFAULT_LIMIT))
    },
    [apiFns, selectedConcept]
  )

  const loadConceptChildrenData = useCallback(
    async ({ setCount, setConceptData, setTypeData }) => {
      const names = [selectedConcept, ...conceptChildren]
      const lists = await Promise.all(names.map(name => apiFns.apiPayload(getConceptHistory, name)))
      const merged = lists.flat()
      setCount(merged.length)
      setConceptData(merged)
      setTypeData(merged.slice(0, DEFAULT_LIMIT))
    },
    [apiFns, conceptChildren, selectedConcept]
  )

  const loadConceptDescendantsData = useCallback(
    async ({ setCount, setConceptData, setTypeData }) => {
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
      setCount(merged.length)
      setConceptData(merged)
      setTypeData(merged.slice(0, DEFAULT_LIMIT))
    },
    [apiFns, getDescendantNames, selectedConcept]
  )

  const loadPendingData = useCallback(
    async ({ setCount, setConceptData, setTypeData }) => {
      // Use pendingHistory for both count and data so pagination works
      setCount(pendingHistory.length)
      setConceptData(pendingHistory)
      setTypeData(pendingHistory.slice(0, DEFAULT_LIMIT))
    },
    [pendingHistory]
  )

  const loadApprovedData = useCallback(
    async ({ setCount, setConceptData, setTypeData }) => {
      const result = await apiFns.apiResult(getHistoryCount, selectedType)
      setCount(result)
      setConceptData([])
      setTypeData([])
    },
    [apiFns, selectedType]
  )

  const loadData = useCallback(
    async ({ setCount, setConceptData, setTypeData, setTypeState }) => {
      if (!apiFns) return

      setTypeState({ limit: DEFAULT_LIMIT, offset: 0 })

      if (selectedType === TYPE.CONCEPT && selectedConcept) {
        if (conceptHistoryExtent === CHILDREN) {
          return loadConceptChildrenData({ setCount, setConceptData, setTypeData })
        }

        if (conceptHistoryExtent === DESCENDANTS) {
          return loadConceptDescendantsData({ setCount, setConceptData, setTypeData })
        }
        return loadConceptData({ setCount, setConceptData, setTypeData })
      }

      if (selectedType === TYPE.PENDING) {
        return loadPendingData({ setCount, setConceptData, setTypeData })
      }

      return loadApprovedData({ setCount, setConceptData, setTypeData })
    },
    [
      apiFns,
      conceptHistoryExtent,
      loadApprovedData,
      loadConceptChildrenData,
      loadConceptData,
      loadConceptDescendantsData,
      loadPendingData,
      selectedConcept,
      selectedType,
    ]
  )

  return loadData
}

export default useLoadData
