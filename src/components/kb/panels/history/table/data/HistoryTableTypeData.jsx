import { use } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'

import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableTypeData = ({ hideFooter = false }) => {
  const { count, nextPage, prevPage, selectedType, setPageSize, pageState } =
    use(HistoryContext)

  const { limit, offset } = pageState
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
      hideFooter={hideFooter}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='server'
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      rowCount={rowCount}
      rows={pageState.data}
    />
  )
}

export default HistoryTableTypeData
