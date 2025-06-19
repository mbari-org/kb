import { use } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableConceptData = ({ columns, hideFooter = false }) => {
  const { count, conceptData, typeState, nextPage, prevPage, setPageSize } = use(HistoryContext)
  const { limit, offset } = typeState

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
      rows={conceptData}
      rowCount={count}
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationMode='client'
      paginationComponent={paginationComponent}
      hideFooter={hideFooter}
    />
  )
}

export default HistoryTableConceptData
