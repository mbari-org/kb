import { use } from 'react'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'
import PanelDataGrid from '@/components/common/panel/PanelDataGrid'

import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import { PAGINATION } from '@/lib/constants/pagination.js'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableConceptData = ({ hideFooter = false }) => {
  const {
    conceptState,
    goToPage,
    nextPage,
    prevPage,
    selectedType,
    setPageSize,
    pageState,
  } = use(HistoryContext)

  const { limit, offset } = pageState
  const columns = useHistoryColumns({ type: selectedType })

  const data = pageState.sortOrder === 'desc' ? [...conceptState.data].reverse() : conceptState.data

  const paginationComponent = (
    <HistoryPagination
      count={conceptState.count}
      goToPage={goToPage}
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
      paginationMode='client'
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      rows={data}
    />
  )
}

export default HistoryTableConceptData
