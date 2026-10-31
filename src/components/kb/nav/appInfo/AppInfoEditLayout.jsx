import { Box, Link, Typography } from '@mui/material'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'

const AppInfoEditLayout = ({ alert, children, description = '', detail = '', hint = {}, onApplyHint }) => {
  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      {children}
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
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
            mt: 1,
            overflowWrap: 'anywhere',
            textAlign: 'center',
            width: '60%',
          }}
        >
          {detail}
        </Typography>
        {hint.TEXT && hint.VALUE && (
          <Typography
            sx={{
              mt: 1,
              overflowWrap: 'anywhere',
              textAlign: 'center',
              width: '60%',
            }}
          >
            {hint.TEXT}: <Link component='button' onClick={() => onApplyHint(hint.VALUE)}>{hint.VALUE}</Link>
          </Typography>
        )}
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', mt: 1 }}>
        {alert ? <ActionsAlert lines={alert.lines} severity={alert.severity || 'info'} /> : null}
      </Box>
    </Box>
  )
}

export default AppInfoEditLayout
