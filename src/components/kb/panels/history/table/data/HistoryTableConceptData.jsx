import { use, useCallback, useMemo } from 'react'

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
    updatePageState,
    pageState,
  } = use(HistoryContext)

  const { limit, offset, sortField, sortOrder } = pageState
  const columns = useHistoryColumns({ type: selectedType })

  const rows = conceptState.data

  const sortModel = useMemo(
    () => [{ field: sortField || 'creationTimestamp', sort: sortOrder || 'desc' }],
    [sortField, sortOrder]
  )

  const onSortModelChange = useCallback(
    model => {
      const item = model[0]
      if (!item?.field || !item?.sort) return

      if (item.field !== 'creationTimestamp' && item.field !== 'field' && item.field !== 'action') {
        return
      }

      if (sortField === item.field && sortOrder === item.sort) return

      updatePageState({ sortField: item.field, sortOrder: item.sort, offset: 0 })
    },
    [sortField, sortOrder, updatePageState]
  )

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
      dataGridProps={{
        disableColumnFilter: true,
        onSortModelChange,
        sortModel,
        sortingMode: 'client',
      }}
      hideFooter={hideFooter}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='client'
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      rows={rows}
    />
  )
}

export default HistoryTableConceptData
