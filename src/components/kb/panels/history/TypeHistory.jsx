import { Box } from '@mui/material'
import HistoryTable from './table/data/HistoryTable'

import useHistoryColumns from './useHistoryColumns'
import useHistoryCount from './useHistoryCount'
import useLoadHistory from './useLoadHistory'

import { capitalize } from '@/lib/util'

const TypeHistory = ({ type }) => {
  const columns = useHistoryColumns({ type })
  const count = useHistoryCount(type)
  const { data, limit, offset, nextPage, prevPage, setPageSize, handleSortChange, sortOrder } =
    useLoadHistory(type, count)

  return (
    <Box>
      <Box sx={{ height: 24 }} /> {/* Spacer to match ConceptSelect height */}
      <HistoryTable
        columns={columns}
        count={count}
        data={data}
        handleSortChange={handleSortChange}
        limit={limit}
        nextPage={nextPage}
        offset={offset}
        prevPage={prevPage}
        setPageSize={setPageSize}
        sortOrder={sortOrder}
        title={capitalize(type)}
        titleTopMargin={3}
        hasConceptSelect={false}
      />
    </Box>
  )
}

export default TypeHistory
