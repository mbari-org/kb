import { use } from 'react'
import { Box, Dialog, Zoom, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import { useTheme } from '@mui/material/styles'

import MediaSwiper from './MediaSwiper'

import ConceptContext from '@/contexts/concept/ConceptContext'

const MediaDisplay = ({ mediaIndex, previewOn, setPreviewOn, setMediaIndex, url }) => {
  const theme = useTheme()
  const { editingState } = use(ConceptContext)
  const mediaItem = editingState.media[mediaIndex]

  // Use provided URL if available, otherwise use mediaItem URL
  const imageUrl = url || mediaItem?.url

  return (
    <Dialog fullScreen open={previewOn} TransitionComponent={Zoom}>
      <IconButton
        onClick={() => setPreviewOn(false)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.background.default,
          },
          backgroundColor: theme.palette.background.paper,
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1301,
        }}
      >
        <IoClose size={24} />
      </IconButton>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {url ? (
          <img
            alt='Concept Media Display'
            onClick={() => setPreviewOn(false)}
            src={imageUrl}
            style={{
              height: '100%',
              objectFit: 'cover',
              width: '100%',
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              margin: 0,
            }}
          >
            <MediaSwiper
              height='100%'
              setMediaIndex={setMediaIndex}
              showNavigation={true}
              slidesPerView={1}
            />
          </Box>
        )}
      </Box>
    </Dialog>
  )
}

export default MediaDisplay
