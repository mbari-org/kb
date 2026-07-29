import { Box, Typography } from '@mui/material'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'

const AppInfoEditLayout = ({ alert, children, description = '' }) => {
  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Typography
          sx={{
            overflowWrap: 'anywhere',
            textAlign: 'center',
            width: '60%',
          }}
        >
          {description}
        </Typography>
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', mt: 1 }}>
        {alert ? <ActionsAlert lines={alert.lines} severity={alert.severity || 'info'} /> : null}
      </Box>
    </Box>
  )
}

export default AppInfoEditLayout
