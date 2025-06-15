import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import HistoryTable from './table/data/HistoryTable'

import useLoadConceptHistory from './useLoadConceptHistory'
import useHistoryColumns from './useHistoryColumns'
import useConceptHistoryPagination from './useConceptHistoryPagination'

import SelectedContext from '@/contexts/selected/SelectedContext'
import { PAGINATION } from '@/lib/constants'

const ConceptHistory = () => {
  const { getSelected } = use(SelectedContext)

  const [count, setCount] = useState(0)
  const [data, setData] = useState([])

  const {
    pageState,
    sortOrder,
    nextPage,
    prevPage,
    setPageSize,
    handleSortChange,
    resetPagination,
  } = useConceptHistoryPagination(count)

  const columns = useHistoryColumns({ type: 'concept' })
  const loadConceptHistory = useLoadConceptHistory()

  useEffect(() => {
    const selectedConcept = getSelected('concept')
    if (selectedConcept) {
      loadConceptHistory(selectedConcept).then(({ data, count }) => {
        setData(data)
        setCount(count)
        // Reset pagination when new data is loaded
        resetPagination()
      })
    } else {
      setData([])
      setCount(0)
      resetPagination()
    }
  }, [getSelected, loadConceptHistory, resetPagination])

  // Get the current page of data
  const currentPageData = data.slice(pageState.offset, pageState.offset + pageState.limit)

  const selectedConcept = getSelected('concept')

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <ConceptSelect conceptName={selectedConcept} sx={{ mt: 1, width: 400 }} />
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
          hasConceptSelect={true}
        />
      </Box>
    </Box>
  )
}

export default ConceptHistory
