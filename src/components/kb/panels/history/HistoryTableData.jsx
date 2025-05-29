import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import HistoryPagination from './HistoryPagination'

import { HISTORY } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = HISTORY.PAGE_SIZE_OPTIONS

const HistoryTableData = ({
  columns,
  count,
  data,
  hideFooter = false,
  limit,
  nextPage,
  offset,
  prevPage,
  setPageSize,
  sortOrder = 'desc',
}) => {
  // Reverse the data array if sortOrder is 'asc'
  const displayData = sortOrder === 'asc' ? [...data].reverse() : data

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        columns={columns}
        disableSelectionOnClick
        hideFooter={hideFooter}
        rows={displayData}
        rowCount={count}
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

export default HistoryTableData
