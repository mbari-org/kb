import HistoryTable from './HistoryTable'

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
    />
  )
}

export default TypeHistory
