import { Button, Stack, Typography, Box } from '@mui/material'

const PanelTotalExport = ({ count, exportFn }) => {
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Box sx={{ minWidth: '90px' }}>
        <Typography variant='body1'>Total: {count}</Typography>
      </Box>
      <Button onClick={exportFn}>Export</Button>
    </Stack>
  )
}

export default PanelTotalExport
