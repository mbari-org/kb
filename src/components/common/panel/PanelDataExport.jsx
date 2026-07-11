import { Box, Button, Stack, Typography } from '@mui/material'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const PanelDataExport = ({ count, countLabel, exportButtonLabel, exportFn, exportTooltip, width }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: width,
      }}
    >
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ minWidth: '100px' }}>
          <Typography variant='body1'>
            {countLabel}: {count}
          </Typography>
        </Box>
        <KBTooltipTarget title={exportTooltip} wrapper='span' wrapperSx={{ display: 'inline-flex' }}>
          <Button disabled={count === 0} onClick={exportFn}>
            {exportButtonLabel}
          </Button>
        </KBTooltipTarget>
      </Stack>
    </Box>
  )
}

export default PanelDataExport
