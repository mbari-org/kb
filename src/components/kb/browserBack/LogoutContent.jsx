import { Stack, Typography } from '@mui/material'

const LogoutContent = () => (
  <Stack spacing={0} sx={{ textAlign: 'center' }}>
    <Typography variant='body1' color='text.secondary'>
      The browser back button closes the Knowledge Base app and logs you out.
    </Typography>
    <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
      You can use the &lt; and &gt; navigation buttons to return to a previous Concept or Panel.
    </Typography>
    <Typography variant='body1' color='text.secondary'>
      Concept buttons are on the Concept selection control and Panel buttons are in the top
      navigation bar.
    </Typography>
    <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
      Each of these buttons provides a long press option to jump to a specific point in the history
      as well.
    </Typography>
    <Typography variant='body1' color='text.secondary' sx={{ mt: 5 }}>
      Are you sure you want to logout?
    </Typography>
  </Stack>
)

export default LogoutContent
