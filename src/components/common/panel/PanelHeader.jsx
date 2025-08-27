import { Box, Typography } from '@mui/material'

const HEADER_HEIGHT = 100

const PanelHeader = ({ headerLeft, headerTitle, headerRight, sx = {} }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: HEADER_HEIGHT,
        ml: 2,
        mr: 2,
        position: 'relative',
        ...sx,
      }}
    >
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        {headerLeft}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Typography
          component='div'
          sx={{
            mt: -2,
            overflow: 'hidden',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '60%',
          }}
        >
          {headerTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        {headerRight}
      </Box>
    </Box>
  )
}

export default PanelHeader
