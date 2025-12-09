import { use } from 'react'
import { Box, Typography } from '@mui/material'

import MediaAdd from '@/components/kb/panels/concepts/concept/change/staged/media/edit/MediaAdd'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import { CONFIG } from '@/config/js'

const { CONCEPT } = CONFIG

const NoMedia = () => {
  const { isEditing } = use(ConceptContext)

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
        {CONCEPT.NO_MEDIA}
      </Typography>
      {isEditing && (
        <Box
          sx={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <MediaAdd
            position='left'
            sx={{
              position: 'relative',
              bottom: 'auto',
              left: 'auto',
              right: 'auto',
              backgroundColor: 'transparent',
              opacity: 1,
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default NoMedia
