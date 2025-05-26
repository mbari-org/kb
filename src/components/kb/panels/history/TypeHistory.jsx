import useHistoryColumns from './useHistoryColumns'
import useHistoryCount from './useHistoryCount'
import useLoadHistory from './useLoadHistory'
import HistoryTable from './HistoryTable'

import { capitalize } from '@/lib/util'

const TypeHistory = ({ type }) => {
  const columns = useHistoryColumns({ type })
  const count = useHistoryCount(type)
  const { data, limit, offset, nextPage, prevPage, setPageSize } = useLoadHistory(type)

  return (
    <HistoryTable
      columns={columns}
      count={count}
      data={data}
      title={capitalize(type)}
      titleTopMargin={3}
      limit={limit}
      offset={offset}
      nextPage={nextPage}
      prevPage={prevPage}
      setPageSize={setPageSize}
    />
  )
}

export default TypeHistory
