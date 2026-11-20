import { memo, useMemo } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import color from '@/config/color.json'

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
  '& .MuiDataGrid-columnHeaders': {
    '& .MuiDataGrid-columnHeader': {
      '& .MuiDataGrid-columnHeaderTitle': {
        fontSize: '1rem',
        fontWeight: 700,
      },
    },
    backgroundColor: 'background.paper',
  },
  '& .MuiDataGrid-columnSeparator': {
    color: color.COLOR.TABLE.BORDER,
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
  '--DataGrid-rowBorderColor': color.COLOR.TABLE.BORDER,
  borderColor: color.COLOR.TABLE.BORDER,
  height: '100%',
}

const FOOTER_SX = {
  backgroundColor: 'background.paper',
  borderTop: `1px solid ${color.COLOR.TABLE.BORDER}`,
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
    () => (paginationMode === 'server' && rowCount !== undefined ? { ...dataGridProps, rowCount } : dataGridProps),
    [dataGridProps, paginationMode, rowCount]
  )

  const containerSx = useMemo(() => ({ ...CONTAINER_SX, ...sx }), [sx])

  // Force a remount when the dataset identity changes. The virtual scroller can otherwise
  // keep stale row DOM after rows are emptied or swapped while the grid is unmeasurable
  // (e.g. inside a display:none keep-alive panel).
  const rowKey = row => row?.id ?? row?.__rowId ?? ''
  const rowsKey = `${rows.length}:${rowKey(rows[0])}:${rowKey(rows[rows.length - 1])}`

  return (
    <Box sx={containerSx}>
      <Box sx={GRID_WRAPPER_SX}>
        <DataGrid
          key={rowsKey}
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
