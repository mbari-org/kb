import { use } from 'react'
import { Box } from '@mui/material'

import MediaView from '@/components/kb/panels/concepts/concept/detail/media/MediaView'
import NoMedia from '@/components/kb/panels/concepts/concept/detail/media/NoMedia'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptMedia = () => {
  const { stagedState } = use(ConceptContext)
  const { media } = stagedState

  return (
    <Box
      sx={{
        flexBasis: '33.33%',
        flexShrink: 0,
        maxHeight: '50%',
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
