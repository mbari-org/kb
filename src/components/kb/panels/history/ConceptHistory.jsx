import { use, useEffect, useState } from 'react'
import { Box } from '@mui/material'

import ConceptSearch from '@/components/common/ConceptSearch'
import HistoryTable from './HistoryTable'

import useLoadConceptHistory from './useLoadConceptHistory'
import useHistoryColumns from './useHistoryColumns'

import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptHistory = () => {
  const { select, selected } = use(SelectedContext)

  const [count, setCount] = useState(0)
  const [data, setData] = useState([])

  const columns = useHistoryColumns({ type: 'concept' })
  const loadConceptHistory = useLoadConceptHistory()

  useEffect(() => {
    if (selected.concept) {
      loadConceptHistory(selected.concept).then(({ data, count }) => {
        setData(data)
        setCount(count)
      })
    } else {
      setData([])
      setCount(0)
    }
  }, [selected.concept, loadConceptHistory])

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

  // Fixed pagination values for ConceptHistory
  const limit = 50
  const offset = 0
  const nextPage = () => {} // No-op since ConceptHistory doesn't support pagination
  const prevPage = () => {} // No-op since ConceptHistory doesn't support pagination
  const setPageSize = () => {} // No-op since ConceptHistory doesn't support pagination

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box sx={{ width: 400 }}>
          <ConceptSearch
            conceptName={selected.concept}
            handleConceptSelect={handleConceptSelect}
            handleKeyUp={handleKeyUp}
          />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, mt: 0 }}>
        <HistoryTable
          columns={columns}
          count={count}
          data={data}
          title={selected.concept || 'Concept History'}
          titleTopMargin={-8}
          limit={limit}
          offset={offset}
          nextPage={nextPage}
          prevPage={prevPage}
          setPageSize={setPageSize}
          hideFooter={true}
        />
      </Box>
    </Box>
  )
}

export default ConceptHistory
