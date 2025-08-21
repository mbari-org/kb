import { use, useCallback, useMemo } from 'react'

import { getConceptHistory, getHistory, getHistoryCount } from '@/lib/api/history'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT

const useHistoryData = ({
  apiFns,
  conceptData,
  conceptHistoryExtent,
  count,
  pendingHistory,
  selectedConcept,
  selectedType,
  sortOrder,
  typeState,
}) => {
  const { getConcept, getDescendantNames } = use(TaxonomyContext)

  const conceptChildren = useMemo(() => {
    if (!selectedConcept || conceptHistoryExtent !== 'children') return []
    const concept = getConcept(selectedConcept)
    return concept?.children || []
  }, [conceptHistoryExtent, getConcept, selectedConcept])

  const loadData = useCallback(
    async ({ setCount, setConceptData, setTypeData, setTypeState }) => {
      if (!apiFns) return

      setTypeState({ limit: DEFAULT_LIMIT, offset: 0 })

      if (selectedType === 'concept' && selectedConcept) {
        if (conceptHistoryExtent === 'children') {
          const names = [selectedConcept, ...conceptChildren]
          const lists = await Promise.all(
            names.map(name => apiFns.apiPayload(getConceptHistory, name))
          )
          const merged = lists.flat()
          setCount(merged.length)
          setConceptData(merged)
          setTypeData(merged.slice(0, DEFAULT_LIMIT))
          return
        }
        if (conceptHistoryExtent === 'descendants') {
          const names = [selectedConcept, ...(await getDescendantNames(selectedConcept))]
          const lists = await Promise.all(
            names.map(name => apiFns.apiPayload(getConceptHistory, name))
          )
          const merged = lists.flat()
          setCount(merged.length)
          setConceptData(merged)
          setTypeData(merged.slice(0, DEFAULT_LIMIT))
          return
        }
        const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
        setCount(data.length)
        setConceptData(data)
        setTypeData(data.slice(0, DEFAULT_LIMIT))
        return
      }

      if (selectedType === 'pending') {
        setCount(pendingHistory.length)
        setConceptData([])
        setTypeData([])
        return
      }

      const result = await apiFns.apiResult(getHistoryCount, selectedType)
      setCount(result)
      setConceptData([])
      setTypeData([])
    },
    [
      apiFns,
      pendingHistory.length,
      selectedConcept,
      selectedType,
      conceptHistoryExtent,
      conceptChildren,
      getDescendantNames,
    ]
  )

  const pageData = useCallback(
    async ({ setTypeData }) => {
      if (!apiFns) return

      if (selectedType === 'concept' && selectedConcept) {
        const start = typeState.offset
        const end = start + typeState.limit
        setTypeData(conceptData.slice(start, end))
        return
      }

      if (selectedType === 'pending') {
        const sortedData =
          sortOrder === 'desc'
            ? [...pendingHistory].sort(
                (a, b) => new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
              )
            : pendingHistory

        const start = typeState.offset
        const end = start + typeState.limit
        setTypeData(sortedData.slice(start, end))
        return
      }

      let actualOffset = typeState.offset
      if (sortOrder === 'desc') {
        const page = Math.floor(typeState.offset / typeState.limit)
        const totalPages = Math.ceil(count / typeState.limit)
        const reversePage = totalPages - 1 - page
        actualOffset = reversePage * typeState.limit
      }

      const data = await apiFns.apiPaginated(getHistory, [
        selectedType,
        { ...typeState, offset: actualOffset },
      ])

      const sortedData = sortOrder === 'desc' ? [...data].reverse() : data
      setTypeData(sortedData)
    },
    [
      apiFns,
      conceptData,
      count,
      pendingHistory,
      selectedConcept,
      selectedType,
      sortOrder,
      typeState,
    ]
  )

  return { loadData, pageData }
}

export default useHistoryData
