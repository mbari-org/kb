import { Stack, Typography } from '@mui/material'

const LogoutContent = () => (
  <Stack spacing={0} sx={{ textAlign: 'center' }}>
    <Typography variant='body1' color='text.secondary'>
      The browser back button closes the Knowledge Base app and logs you out.
    </Typography>
    <Typography variant='body1' color='text.secondary'>
      Are you sure you want to logout?
    </Typography>
  </Stack>
)

export default LogoutContent
