import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import HistoryTable from './HistoryTable'

import useLoadConceptHistory from './useLoadConceptHistory'
import useHistoryColumns from './useHistoryColumns'

import SelectedContext from '@/contexts/selected/SelectedContext'
import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT

const ConceptHistory = () => {
  const { getSelected, select } = use(SelectedContext)

  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const [pageState, setPageState] = useState({ limit: DEFAULT_LIMIT, offset: 0 })
  const [sortOrder, setSortOrder] = useState('desc')

  const columns = useHistoryColumns({ type: 'concept' })
  const loadConceptHistory = useLoadConceptHistory()

  useEffect(() => {
    const selectedConcept = getSelected('concept')
    if (selectedConcept) {
      loadConceptHistory(selectedConcept).then(({ data, count }) => {
        setData(data)
        setCount(count)
        // Reset pagination when new data is loaded
        setPageState({ limit: DEFAULT_LIMIT, offset: 0 })
      })
    } else {
      setData([])
      setCount(0)
      setPageState({ limit: DEFAULT_LIMIT, offset: 0 })
    }
  }, [getSelected, loadConceptHistory])

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      select({ concept: selectedName })
    }
  }

  const handleKeyUp = (event, taxonomyNames) => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        select({ concept: conceptName })
        document.activeElement.blur()
      }
    }
  }

  // Client-side pagination handlers
  const nextPage = () => {
    setPageState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, count - prev.limit),
    }))
  }

  const prevPage = () => {
    setPageState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }

  const setPageSize = newLimit => {
    setPageState(_prev => ({
      limit: newLimit,
      offset: 0,
    }))
  }

  // Handle sort order change
  const handleSortChange = newSortOrder => {
    setSortOrder(newSortOrder)
    // Reset to first page when sort order changes
    setPageState(prev => ({ ...prev, offset: 0 }))
  }

  // Get the current page of data
  const currentPageData = data.slice(pageState.offset, pageState.offset + pageState.limit)

  const selectedConcept = getSelected('concept')

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box sx={{ mt: 0.75, width: 400 }}>
          <ConceptSelect
            conceptName={selectedConcept}
            handleConceptSelect={handleConceptSelect}
            handleKeyUp={handleKeyUp}
          />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, mt: 0 }}>
        <HistoryTable
          columns={columns}
          count={count}
          data={currentPageData}
          handleSortChange={handleSortChange}
          limit={pageState.limit}
          offset={pageState.offset}
          nextPage={nextPage}
          prevPage={prevPage}
          setPageSize={setPageSize}
          sortOrder={sortOrder}
          title={selectedConcept || 'Concept History'}
          titleTopMargin={-8}
        />
      </Box>
    </Box>
  )
}

export default ConceptHistory
