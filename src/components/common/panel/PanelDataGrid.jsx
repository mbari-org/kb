import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import PropTypes from 'prop-types'

/**
 * A reusable DataGrid component with pagination controls pinned to the bottom.
 * This allows the data to scroll independently while keeping pagination always visible.
 *
 * @param {Object} props
 * @param {Array} props.columns - DataGrid columns configuration
 * @param {Array} props.rows - Data to display in the grid
 * @param {number} props.rowCount - Total number of rows for pagination (only used with server pagination)
 * @param {Object} props.paginationModel - Current pagination state
 * @param {Array} props.pageSizeOptions - Available page size options
 * @param {string} props.paginationMode - 'client' or 'server' pagination mode
 * @param {React.ReactNode} props.paginationComponent - Custom pagination component to render
 * @param {boolean} props.hideFooter - Whether to hide the pagination footer
 * @param {Object} props.dataGridProps - Additional props to pass to DataGrid
 * @param {Object} props.sx - Additional styles for the container
 */

const PanelDataGrid = ({
  columns,
  rows,
  rowCount,
  paginationModel,
  pageSizeOptions,
  paginationMode = 'server',
  paginationComponent,
  hideFooter = false,
  dataGridProps = {},
  sx = {},
}) => {
  // Only pass rowCount when using server pagination
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
        minHeight: 400, // Ensure minimum height for DataGrid as per MUI docs
        maxHeight: '100vh', // Prevent overflow
        ...sx,
      }}
    >
      <Box
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          overflow: 'hidden',
          // Ensure this container has intrinsic dimensions for DataGrid
          height: '100%',
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          paginationModel={paginationModel}
          pageSizeOptions={pageSizeOptions}
          paginationMode={paginationMode}
          hideFooter={true} // Always hide default footer
          getRowHeight={() => 'auto'}
          disableRowSelectionOnClick
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
            // Remove default footer spacing
            '& .MuiDataGrid-footerContainer': {
              display: 'none',
            },
          }}
          {...dataGridPropsWithRowCount}
        />
      </Box>

      {/* Custom pagination pinned to bottom */}
      {!hideFooter && paginationComponent && (
        <Box
          sx={{
            flexShrink: 0,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
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

PanelDataGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  rowCount: PropTypes.number,
  paginationModel: PropTypes.object.isRequired,
  pageSizeOptions: PropTypes.array.isRequired,
  paginationMode: PropTypes.oneOf(['client', 'server']),
  paginationComponent: PropTypes.node,
  hideFooter: PropTypes.bool,
  dataGridProps: PropTypes.object,
  sx: PropTypes.object,
}

export default PanelDataGrid
