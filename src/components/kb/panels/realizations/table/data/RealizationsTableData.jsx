import { use, useCallback, useMemo, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import RealizationsPagination from '@/components/kb/panels/realizations/table/data/RealizationsPagination'
import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'

import { PAGINATION } from '@/lib/constants/pagination.js'

const { PAGE_SIZE_OPTIONS, DEFAULT_LIMIT } = PAGINATION.REALIZATIONS

const DATA_GRID_PROPS = {
  disableColumnFilter: true,
  disableColumnMenu: true,
  getRowId: row => row.__rowId,
}

const RealizationsTableData = () => {
  const { filteredRealizations } = use(RealizationsContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT)

  const columns = useRealizationColumns()
  const realizationRows = useMemo(
    () => filteredRealizations.map((realization, index) => ({ ...realization, __rowId: realization.id || `${index}` })),
    [filteredRealizations]
  )
  const totalPages = Math.max(1, Math.ceil(realizationRows.length / pageSize))
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages)

  const handlePageChange = useCallback(newPage => {
    setCurrentPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback(newPageSize => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleSortModelChange = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const dataGridProps = useMemo(
    () => ({ ...DATA_GRID_PROPS, onSortModelChange: handleSortModelChange }),
    [handleSortModelChange]
  )

  const paginationComponent = useMemo(
    () => (
      <RealizationsPagination
        currentPage={currentPageClamped}
        realizations={realizationRows}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSize={pageSize}
      />
    ),
    [currentPageClamped, handlePageChange, handlePageSizeChange, pageSize, realizationRows]
  )

  const paginationModel = useMemo(
    () => ({
      page: currentPageClamped - 1,
      pageSize,
    }),
    [currentPageClamped, pageSize]
  )

  return (
    <PanelDataGrid
      columns={columns}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='client'
      paginationModel={paginationModel}
      dataGridProps={dataGridProps}
      rowCount={realizationRows.length}
      rows={realizationRows}
    />
  )
}

export default RealizationsTableData