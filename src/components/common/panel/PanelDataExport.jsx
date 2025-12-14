import { Box, Button, Stack, Typography } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelDataExport = ({
  count,
  countLabel,
  exportButtonLabel,
  exportFn,
  exportTooltip,
  width,
}) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: width,
      }}
    >
      <Stack direction='row' spacing={1} alignItems='center'>
        <Box sx={{ minWidth: '100px' }}>
          <Typography variant='body1'>{countLabel}: {count}</Typography>
        </Box>
        <KBTooltip title={exportTooltip}>
          <Box component='span'>
            <Button disabled={count === 0} onClick={exportFn}>{exportButtonLabel}</Button>
          </Box>
        </KBTooltip>
      </Stack>
    </Box>
  )
}

export default PanelDataExport
