import { Box, Stack } from '@mui/material'

/**
 * A standard panel component that provides consistent layout and styling for table-based panel content.
 * @param {Object} props
 * @param {React.ReactNode} props.header - Content to be rendered in the header area
 * @param {React.ReactNode} props.panelTable - Content to be rendered in the table area
 * @param {Object} props.sx - Additional styles to be applied to the panel container
 */
const TablePanel = ({ header, panelTable, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        mt: 2,
        width: '100%',
        ...sx,
      }}
    >
      <Stack
        direction='column'
        spacing={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {header && (
          <Box
            sx={{
              flexShrink: 0,
            }}
          >
            {header}
          </Box>
        )}
        <Box
          sx={{
            flex: '1 1 auto',
            minHeight: 0, // Important for proper flex behavior
            overflow: 'auto',
          }}
        >
          {panelTable}
        </Box>
      </Stack>
    </Box>
  )
}

export default TablePanel
