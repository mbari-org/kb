import { Typography, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const HistoryTable = ({ columns, count, data, title, titleTopMargin = 0 }) => {
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
          pageSize={5}
          rowsPerPageOptions={[5]}
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
