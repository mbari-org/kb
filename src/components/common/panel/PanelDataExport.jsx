import { Box, Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelDataExport = ({
  checked,
  count,
  exportFn,
  exportToolTip = 'Export',
  switchFn,
  switchLabel,
  switchToolTip = '',
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
          <Typography variant='body1'>Total: {count}</Typography>
        </Box>
        <KBTooltip title={exportToolTip}>
          <Box component='span'>
            <Button disabled={count === 0} onClick={exportFn}>Export</Button>
          </Box>
        </KBTooltip>
      </Stack>
      <Box>
        <KBTooltip title={switchToolTip}>
          <FormControlLabel
            control={
              <Switch size='small' checked={checked} onChange={switchFn} />
            }
            label={switchLabel}
          />
        </KBTooltip>
      </Box>
    </Box>
  )
}

export default PanelDataExport
