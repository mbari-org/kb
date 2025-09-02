import { Button, Stack, Typography, Box } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelDataExport = ({ count, exportFn, toolTip = 'Export' }) => {
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Box sx={{ minWidth: '100px' }}>
        <Typography variant='body1'>Total: {count}</Typography>
      </Box>
      <KBTooltip title={toolTip}>
        <Button onClick={exportFn}>Export</Button>
      </KBTooltip>
    </Stack>
  )
}

export default PanelDataExport
