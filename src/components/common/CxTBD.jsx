import { Box, Typography } from '@mui/material'

const CxTBD = ({ text = 'TBD' }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        border: '2px solid darkblue',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Typography variant='body1'>{text}</Typography>
    </Box>
  )
}

export default CxTBD
