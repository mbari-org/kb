import { Box, Link, Typography } from '@mui/material'
import { Fragment } from 'react'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'

const hintValues = hint => {
  if (hint.VALUE) return [hint.VALUE]
  return hint.VALUES || []
}

const AppInfoEditLayout = ({ alert, children, description = '', detail = '', hint = {}, onApplyHint }) => {
  const values = hintValues(hint)

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
        {hint.TEXT && values.length > 0 && (
          <Typography
            sx={{
              mt: 1,
              overflowWrap: 'anywhere',
              textAlign: 'center',
              width: '60%',
            }}
          >
            {hint.TEXT}:{' '}
            {values.map((value, index) => (
              <Fragment key={value}>
                {index > 0 && ', '}
                <Link component='button' onClick={() => onApplyHint(value)}>
                  {value}
                </Link>
              </Fragment>
            ))}
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
