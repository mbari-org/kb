import { Stack, Typography } from '@mui/material'

const LastAdminContent = () => {
  return (
    <Stack spacing={0} sx={{ textAlign: 'center' }}>
      <Typography variant='body1' color='text.secondary'>
        You cannot lock the last unlocked admin.
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Please unlock another admin first.
      </Typography>
    </Stack>
  )
}

export default LastAdminContent
