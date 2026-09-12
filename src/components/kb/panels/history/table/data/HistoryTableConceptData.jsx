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
    pageState,
    sortField,
    sortOrder,
    updateSort,
  } = use(HistoryContext)

  const { limit, offset } = pageState
  const columns = useHistoryColumns({ type: selectedType })

  const rows = conceptState.data

  const sortModel = useMemo(
    () => [{ field: sortField, sort: sortOrder }],
    [sortField, sortOrder]
  )

  const onSortModelChange = useCallback(
    model => {
      const item = model[0]
      if (!item?.field || !item?.sort) return
      if (sortField === item.field && sortOrder === item.sort) return

      updateSort({ field: item.field, order: item.sort })
    },
    [sortField, sortOrder, updateSort]
  )

  const paginationComponent = useMemo(
    () => (
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
    ),
    [conceptState.count, goToPage, hideFooter, limit, nextPage, offset, prevPage, setPageSize]
  )

  const dataGridProps = useMemo(
    () => ({
      disableColumnFilter: true,
      onSortModelChange,
      sortModel,
      sortingMode: 'client',
    }),
    [onSortModelChange, sortModel]
  )

  const paginationModel = useMemo(
    () => ({
      pageSize: limit,
      page: Math.floor(offset / limit),
    }),
    [limit, offset]
  )

  return (
    <PanelDataGrid
      columns={columns}
      dataGridProps={dataGridProps}
      hideFooter={hideFooter}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='client'
      paginationModel={paginationModel}
      rows={rows}
    />
  )
}

export default HistoryTableConceptData
