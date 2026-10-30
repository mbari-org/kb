import { Box, InputAdornment, Link, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

import KBInfoIcon from '@/components/icon/KBInfoIcon'
import KBPopover from '@/components/common/popover/KBPopover'

const ServiceInfo = ({ disabled, onApplyDefault }) => {
  const configServiceInfo = ({ close }) => (
    <Box>
      <Typography>{CONFIG.LOGIN.CONFIG_SERVICE.DESCRIPTION}</Typography>
      <Typography sx={{ mt: 1 }}>
        {CONFIG.LOGIN.CONFIG_SERVICE.DETAIL}{' '}
        <Link component='button' onClick={() => onApplyDefault(close)}>
          {CONFIG.LOGIN.CONFIG_SERVICE.DEFAULT}
        </Link>
      </Typography>
    </Box>
  )

  return (
    <InputAdornment position='end'>
      {disabled ? (
        <KBInfoIcon disabled />
      ) : (
        <KBPopover content={configServiceInfo} paperSx={{ maxWidth: 300 }}>
          <KBInfoIcon />
        </KBPopover>
      )}
    </InputAdornment>
  )
}

export default ServiceInfo
