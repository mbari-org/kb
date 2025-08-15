import { Box } from '@mui/material'

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
          flexShrink: 0,
          pt: 0,
          pl: 2,
          pr: 2,
          pb: 0,
        }}
      >
        {tableHeader}
      </Box>

      <Box
        sx={{
          flex: '1 1 auto',
          minHeight: 0, // Important for proper flex behavior
          overflow: 'auto',
          pl: 2,
          pr: 2,
          mb: 2,
        }}
      >
        {tableData}
      </Box>
    </Box>
  )
}

export default PanelTable
