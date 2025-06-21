import { use } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'

import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableTypeData = ({ hideFooter = false }) => {
  const { count, typeData, typeState, nextPage, prevPage, selectedType, setPageSize } =
    use(HistoryContext)

  const { limit, offset } = typeState
  const columns = useHistoryColumns({ type: selectedType })

  // Ensure rowCount is at least 1 to prevent MUI X error
  const rowCount = Math.max(1, count)

  const paginationComponent = (
    <HistoryPagination
      count={count}
      hideFooter={hideFooter}
      limit={limit}
      nextPage={nextPage}
      offset={offset}
      prevPage={prevPage}
      setPageSize={setPageSize}
    />
  )

  return (
    <PanelDataGrid
      columns={columns}
      rows={typeData}
      rowCount={rowCount}
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationMode='server'
      paginationComponent={paginationComponent}
      hideFooter={hideFooter}
    />
  )
}

export default HistoryTableTypeData
