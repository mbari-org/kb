import { memo, useMemo } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const CONTAINER_SX = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 400,
  maxHeight: '100vh',
}

const GRID_WRAPPER_SX = {
  flex: '1 1 auto',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
}

const GRID_SX = {
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
}

const FOOTER_SX = {
  backgroundColor: 'background.paper',
  borderColor: 'divider',
  borderTop: 1,
  flexShrink: 0,
  pb: 1,
  pt: 1,
}

const EMPTY_PROPS = {}

const getRowHeight = () => 'auto'

const PanelDataGrid = ({
  columns,
  dataGridProps = EMPTY_PROPS,
  hideFooter = false,
  pageSizeOptions,
  paginationComponent,
  paginationModel,
  paginationMode = 'server',
  rowCount,
  rows,
  sx = EMPTY_PROPS,
}) => {
  const dataGridPropsWithRowCount = useMemo(
    () =>
      paginationMode === 'server' && rowCount !== undefined
        ? { ...dataGridProps, rowCount }
        : dataGridProps,
    [dataGridProps, paginationMode, rowCount]
  )

  const containerSx = useMemo(() => ({ ...CONTAINER_SX, ...sx }), [sx])

  return (
    <Box sx={containerSx}>
      <Box sx={GRID_WRAPPER_SX}>
        <DataGrid
          columns={columns}
          disableRowSelectionOnClick
          disableSelectionOnClick
          getRowHeight={getRowHeight}
          hideFooter={true}
          pageSizeOptions={pageSizeOptions}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          rows={rows}
          sx={GRID_SX}
          {...dataGridPropsWithRowCount}
        />
      </Box>

      {!hideFooter && paginationComponent && <Box sx={FOOTER_SX}>{paginationComponent}</Box>}
    </Box>
  )
}

export default memo(PanelDataGrid)
