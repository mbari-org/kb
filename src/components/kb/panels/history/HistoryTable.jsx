import { Typography, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import HistoryPagination from './HistoryPagination'

import { HISTORY } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = HISTORY.PAGE_SIZE_OPTIONS

const HistoryTable = ({
  columns,
  count,
  data,
  title,
  titleTopMargin = 0,
  limit,
  offset,
  nextPage,
  prevPage,
  setPageSize,
  hideFooter = false,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography align='center' sx={{ mt: titleTopMargin, mb: 1 }} variant='h4'>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ ml: 2 }}>Total: {count}</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <DataGrid
          rows={data}
          columns={columns}
          paginationModel={{
            pageSize: limit,
            page: Math.floor(offset / limit),
          }}
          rowCount={count}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          paginationMode='server'
          hideFooter={hideFooter}
          disableSelectionOnClick
          slots={{
            pagination: () => (
              <HistoryPagination
                limit={limit}
                offset={offset}
                count={count}
                nextPage={nextPage}
                prevPage={prevPage}
                setPageSize={setPageSize}
                hideFooter={hideFooter}
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
    </Box>
  )
}

export default HistoryTable
