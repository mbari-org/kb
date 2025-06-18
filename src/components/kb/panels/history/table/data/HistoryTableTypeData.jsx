import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { use } from 'react'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryPagination from './HistoryPagination'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableTypeData = ({ columns, hideFooter = false }) => {
  const { count, typeData, typeState, sortOrder, nextPage, prevPage, setPageSize } =
    use(HistoryContext)
  const { limit, offset } = typeState

  // Ensure rowCount is at least 1 to prevent MUI X error
  const rowCount = Math.max(1, count)

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        columns={columns}
        disableRowSelectionOnClick
        disableSelectionOnClick
        hideFooter={hideFooter}
        getRowHeight={() => 'auto'}
        rows={typeData}
        rowCount={rowCount}
        paginationMode='server'
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        slots={{
          pagination: () => (
            <HistoryPagination
              count={count}
              hideFooter={hideFooter}
              limit={limit}
              nextPage={nextPage}
              offset={offset}
              prevPage={prevPage}
              setPageSize={setPageSize}
            />
          ),
        }}
        sx={{
          height: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.paper',
            '& .MuiDataGrid-columnHeader': {
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                fontSize: '1rem',
              },
            },
          },
        }}
      />
    </Box>
  )
}

export default HistoryTableTypeData
