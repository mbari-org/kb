import { memo } from 'react'
import { Box, Stack } from '@mui/material'

const CONTAINER_SX = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
}

const STACK_SX = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

const HEADER_SX = {
  flexShrink: 0,
}

const TABLE_SX = {
  flex: '1 1 auto',
  minHeight: 0, // Important for proper flex behavior
  overflow: 'auto',
}

/**
 * A standard panel component that provides consistent layout and styling for table-based panel content.
 * @param {Object} props
 * @param {React.ReactNode} props.header - Content to be rendered in the header area
 * @param {React.ReactNode} props.panelTable - Content to be rendered in the table area
 * @param {Object} props.sx - Additional styles to be applied to the panel container
 */
const TablePanel = ({ header, panelTable, sx = {} }) => {
  return (
    <Box sx={{ ...CONTAINER_SX, ...sx }}>
      <Stack direction='column' spacing={0} sx={STACK_SX}>
        {header && <Box sx={HEADER_SX}>{header}</Box>}
        <Box sx={TABLE_SX}>{panelTable}</Box>
      </Stack>
    </Box>
  )
}

export default memo(TablePanel)
