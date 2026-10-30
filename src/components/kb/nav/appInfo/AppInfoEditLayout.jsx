import { Box, Typography } from '@mui/material'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'

const AppInfoEditLayout = ({ alert, children, description = '', detail = '' }) => {
  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      {children}
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 1 }}>
        <Typography
          sx={{
            overflowWrap: 'anywhere',
            textAlign: 'center',
            width: '60%',
          }}
        >
          {description}
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            overflowWrap: 'anywhere',
            textAlign: 'center',
            width: '60%',
          }}
        >
          {detail}
        </Typography>
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', mt: 1 }}>
        {alert ? <ActionsAlert lines={alert.lines} severity={alert.severity || 'info'} /> : null}
      </Box>
    </Box>
  )
}

export default AppInfoEditLayout
