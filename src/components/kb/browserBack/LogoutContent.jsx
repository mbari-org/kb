import { Box, Stack, Typography } from '@mui/material'

import logoutModal from '@/text/config/logoutModal.json'

const LogoutContent = () => (
  <Stack spacing={0} sx={{ textAlign: 'left' }}>
    <Typography variant='body1' sx={{ textAlign: 'center' }}>
      {logoutModal.MESSAGE.DESCRIPTION}
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Typography variant='body1' >
        <span dangerouslySetInnerHTML={{ __html: logoutModal.MESSAGE.NAV_BUTTONS.DESCRIPTION }} />
      </Typography>
      <Box component='ul' sx={{ mt: 0, mb: 0, pl: 5 }}>
        <li>{logoutModal.MESSAGE.NAV_BUTTONS.CONCEPTS}</li>
        <li>{logoutModal.MESSAGE.NAV_BUTTONS.PANELS}</li>
      </Box>
    </Box>
    <Typography variant='body1' >
      {logoutModal.MESSAGE.NAV_BUTTONS.LONG_PRESS}
    </Typography>
    <Typography variant='body1' sx={{ mt: 5, textAlign: 'center' }}>
      {logoutModal.MESSAGE.CONFIRM}
    </Typography>
  </Stack>
)

export default LogoutContent
