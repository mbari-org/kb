import { use } from 'react'
import { Box } from '@mui/material'

import MediaView from './MediaView'
import NoMedia from './NoMedia'

import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptMedia = () => {
  const { editingState } = use(ConceptContext)
  const media = editingState.media

  return (
    <Box
      sx={{
        flexBasis: '33.33%',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {media?.length === 0 && <NoMedia />}
      {media?.length > 0 && <MediaView />}
    </Box>
  )
}

export default ConceptMedia
