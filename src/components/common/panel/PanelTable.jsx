import { Box } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * A table component for panels that provides a consistent layout with header and data sections.
 * @param {Object} props
 * @param {React.ReactNode} props.tableHeader - Content for the table header section
 * @param {React.ReactNode} props.tableData - Content for the table data section
 * @param {Object} props.sx - Additional styles to be applied to the table container
 */
const PanelTable = ({ tableHeader, tableData, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        ...sx,
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          p: 2,
        }}
      >
        {tableHeader}
      </Box>

      <Box
        sx={{
          flex: '1 1 auto',
          minHeight: 0, // Important for proper flex behavior
          overflow: 'auto',
          p: 2,
        }}
      >
        {tableData}
      </Box>
    </Box>
  )
}

PanelTable.propTypes = {
  tableHeader: PropTypes.node.isRequired,
  tableData: PropTypes.node.isRequired,
  sx: PropTypes.object,
}

export default PanelTable
