import useHistoryColumns from './useHistoryColumns'
import useHistoryCount from './useHistoryCount'
import useLoadHistory from './useLoadHistory'
import HistoryTable from './HistoryTable'

const TypeHistory = ({ type }) => {
  const columns = useHistoryColumns({ type })
  const count = useHistoryCount(type)
  const history = useLoadHistory(type)

  return (
    <HistoryTable
      title={type === 'pending' ? 'Pending History' : 'Approved History'}
      count={count}
      history={history.history}
      columns={columns}
    />
  )
}

export default TypeHistory
