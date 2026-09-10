import { use, useCallback, useMemo } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'

import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import { CONCEPT } from '@/lib/constants'
import { PAGINATION } from '@/lib/constants/pagination.js'

const { TYPE } = CONCEPT.HISTORY
const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableTypeData = ({ hideFooter = false }) => {
  const {
    conceptState,
    goToPage,
    nextPage,
    pageState,
    prevPage,
    selectedType,
    setPageSize,
    updatePageState,
  } =
    use(HistoryContext)

  const { limit, offset, sortField, sortOrder } = pageState
  const columns = useHistoryColumns({ type: selectedType })

  // Ensure rowCount is at least 1 to prevent MUI X error
  const rowCount = Math.max(1, conceptState.count)

  const rows = useMemo(
    () => (pageState.sortOrder === 'desc' ? [...pageState.data].reverse() : pageState.data),
    [pageState.data, pageState.sortOrder]
  )

  const onSortModelChange = useCallback(
    model => {
      const item = model[0]
      if (!item?.field || !item?.sort) return
      if (sortField === item.field && sortOrder === item.sort) return

      updatePageState({ sortField: item.field, sortOrder: item.sort, offset: 0 })
    },
    [sortField, sortOrder, updatePageState]
  )

  const dataGridProps = useMemo(
    () => (selectedType === TYPE.PENDING ? { onSortModelChange } : undefined),
    [onSortModelChange, selectedType]
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

  const paginationModel = useMemo(
    () => ({
      page: Math.floor(offset / limit),
      pageSize: limit,
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
      paginationMode='server'
      paginationModel={paginationModel}
      rowCount={rowCount}
      rows={rows}
    />
  )
}

export default HistoryTableTypeData
