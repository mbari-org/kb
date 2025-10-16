import { use } from 'react'
import { Box, Dialog, Zoom, IconButton } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'
import { useTheme } from '@mui/material/styles'

import MediaSwiper from './MediaSwiper'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const MediaDisplay = ({ previewOn, setPreviewOn, url }) => {
  const theme = useTheme()
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)
  const mediaItem = media[mediaIndex]

  const imageUrl = url || mediaItem?.url

  return (
    <Dialog fullScreen open={previewOn} slotProps={{ backdrop: { TransitionComponent: Zoom } }}>
      <IconButton
        onClick={() => setPreviewOn(false)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.background.default,
          },
          backgroundColor: theme.palette.background.paper,
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1301,
        }}
      >
        <IoCloseSharp size={32} />
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
        {url && (
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
        )}
        {!url && (
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
            <MediaSwiper height='100%' showNavigation={true} slidesPerView={1} />
          </Box>
        )}
      </Box>
    </Dialog>
  )
}

export default MediaDisplay
