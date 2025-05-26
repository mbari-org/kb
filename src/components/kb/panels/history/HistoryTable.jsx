import { Typography, Box, TextField, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

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

  const handlePageInputChange = event => {
    const newPage = parseInt(event.target.value) - 1 // Convert to 0-based index
    if (!isNaN(newPage) && newPage >= 0 && newPage < Math.ceil(count / limit)) {
      const currentPage = Math.floor(offset / limit)
      if (newPage > currentPage) {
        nextPage()
      } else if (newPage < currentPage) {
        prevPage()
      }
    }
  }

  const CustomPagination = () => {
    const currentPage = Math.floor(offset / limit) + 1 // Convert to 1-based index
    const totalPages = Math.ceil(count / limit)

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
        <Typography>Page</Typography>
        <TextField
          size='small'
          type='number'
          value={currentPage}
          onChange={handlePageInputChange}
          inputProps={{
            min: 1,
            max: totalPages,
            style: { textAlign: 'center', width: '60px' },
          }}
        />
        <Typography>of {totalPages}</Typography>
      </Box>
    )
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
          slots={{
            pagination: hideFooter
              ? () => null
              : () => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      px: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>Rows per page:</Typography>
                      <select
                        value={limit}
                        onChange={e => setPageSize(Number(e.target.value))}
                        style={{ margin: '0 8px' }}
                      >
                        {[5, 10, 25, 50].map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <Typography>
                        {offset + 1}-{Math.min(offset + limit, count)} of {count}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CustomPagination />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={prevPage} disabled={offset === 0} size='small'>
                          <IoIosArrowBack />
                        </IconButton>
                        <IconButton
                          onClick={nextPage}
                          disabled={offset + limit >= count}
                          size='small'
                        >
                          <IoIosArrowForward />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
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
