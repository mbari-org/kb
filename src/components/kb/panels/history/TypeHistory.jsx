import useHistoryColumns from './useHistoryColumns'
import useHistoryCount from './useHistoryCount'
import useLoadHistory from './useLoadHistory'
import HistoryTable from './HistoryTable'

import { capitalize } from '@/lib/util'

const TypeHistory = ({ type }) => {
  const columns = useHistoryColumns({ type })
  const count = useHistoryCount(type)
  const history = useLoadHistory(type)

  return (
    <HistoryTable
      columns={columns}
      count={count}
      data={history.data}
      title={capitalize(type)}
      titleTopMargin={3}
    />
  )
}

export default TypeHistory
