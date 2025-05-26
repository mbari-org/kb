import { Typography, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

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
  const handlePaginationModelChange = model => {
    const currentPage = Math.floor(offset / limit)
    if (model.page > currentPage) {
      nextPage()
    } else if (model.page < currentPage) {
      prevPage()
    }
    if (model.pageSize !== limit) {
      setPageSize(model.pageSize)
    }
  }

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
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode='server'
          hideFooter={hideFooter}
          disableSelectionOnClick
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
