import { Box, Stack, Typography } from '@mui/material'

const DeleteConceptContent = () => {
  return (
    <Box>
      <Typography align='center' color='cancel' variant='h5' sx={{ mt: 1, mb: 2 }}>
        WARNING
      </Typography>
      <Stack direction='column' spacing={0.5} alignItems='center'>
        <Typography align='center'>Be sure you really want to delete this concept.</Typography>
        <Typography align='center'>
          Nancy has a ruler and will crack your knuckles if you mess this up.
        </Typography>
      </Stack>
    </Box>
  )
}

export default DeleteConceptContent
