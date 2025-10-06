import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const PanelDataGrid = ({
  columns,
  dataGridProps = {},
  hideFooter = false,
  pageSizeOptions,
  paginationComponent,
  paginationModel,
  paginationMode = 'server',
  rowCount,
  rows,
  sx = {},
}) => {
  const dataGridPropsWithRowCount =
    paginationMode === 'server' && rowCount !== undefined
      ? { ...dataGridProps, rowCount }
      : dataGridProps

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 400,
        maxHeight: '100vh',
        ...sx,
      }}
    >
      <Box
        sx={{
          flex: '1 1 auto',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          columns={columns}
          disableRowSelectionOnClick
          disableSelectionOnClick
          getRowHeight={() => 'auto'}
          hideFooter={true}
          pageSizeOptions={pageSizeOptions}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          rows={rows}
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
            '& .MuiDataGrid-footerContainer': {
              display: 'none',
            },
          }}
          {...dataGridPropsWithRowCount}
        />
      </Box>

      {!hideFooter && paginationComponent && (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderColor: 'divider',
            borderTop: 1,
            flexShrink: 0,
            pb: 1,
            pt: 1,
          }}
        >
          {paginationComponent}
        </Box>
      )}
    </Box>
  )
}

export default PanelDataGrid
