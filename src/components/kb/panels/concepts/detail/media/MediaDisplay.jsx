import { use } from 'react'
import { Box, Dialog, Zoom } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'

const MediaDisplay = ({ mediaIndex, previewImage, setPreviewImage, url }) => {
  const { editingState } = use(ConceptContext)
  const mediaItem = editingState.media[mediaIndex]

  // Use provided URL if available, otherwise use mediaItem URL
  const imageUrl = url || mediaItem?.url

  return (
    <Dialog fullScreen open={previewImage} TransitionComponent={Zoom}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <img
          alt='Concept Media Display'
          onClick={() => setPreviewImage(false)}
          src={imageUrl}
          style={{
            height: '100%',
            objectFit: 'contain',
            width: '100%',
          }}
        />
      </Box>
    </Dialog>
  )
}

export default MediaDisplay
