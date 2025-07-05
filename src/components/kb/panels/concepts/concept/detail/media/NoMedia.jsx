import { use } from 'react'
import { Box, Typography } from '@mui/material'

import MediaAdd from '../../change/staged/concept/media/edit/MediaAdd'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const NoMedia = () => {
  const { editing } = use(ConceptContext)

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        mt: 8,
        textAlign: 'center',
      }}
    >
      <Typography
        variant='h4'
        align='center'
        sx={{
          color: '#888',
          fontWeight: 'bold',
          left: '50%',
          letterSpacing: '0.1em',
          opacity: 0.2,
          pointerEvents: 'none',
          position: 'absolute',
          textTransform: 'uppercase',
          top: '10%',
          transform: 'translateX(-50%) rotate(-45deg)',
          zIndex: 1,
        }}
      >
        No Media
      </Typography>
      {editing && <MediaAdd bgColor='transparent' sx={{ mt: 10 }} />}
    </Box>
  )
}

export default NoMedia
