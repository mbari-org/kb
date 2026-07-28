import { use, useEffect, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import RealizationsPagination from '@/components/kb/panels/realizations/table/data/RealizationsPagination'
import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'

import { PAGINATION } from '@/lib/constants/pagination.js'

const { PAGE_SIZE_OPTIONS, DEFAULT_LIMIT } = PAGINATION.REALIZATIONS

const RealizationsTableData = () => {
  const { filteredRealizations } = use(RealizationsContext)
  const [displayRealizations, setDisplayRealizations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT)

  const columns = useRealizationColumns()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!filteredRealizations || filteredRealizations.length === 0) {
        setDisplayRealizations([])
        return
      }

      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      setDisplayRealizations(
        filteredRealizations
          .slice(startIndex, endIndex)
          .map((realization, index) => ({ ...realization, __rowId: realization.id || `${startIndex + index}` }))
      )
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [filteredRealizations, currentPage, pageSize])

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const paginationComponent = (
    <RealizationsPagination
      currentPage={currentPage}
      displayRealizations={filteredRealizations}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      pageSize={pageSize}
    />
  )

  return (
    <PanelDataGrid
      columns={columns}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='client'
      paginationModel={{
        page: currentPage - 1,
        pageSize,
      }}
      dataGridProps={{
        disableColumnFilter: true,
        disableColumnMenu: true,
        disableColumnSorting: true,
        getRowId: row => row.__rowId,
      }}
      rowCount={filteredRealizations.length}
      rows={displayRealizations}
    />
  )
}

export default RealizationsTableData