import { use } from 'react'
import { Box } from '@mui/material'

import MediaView from '@/components/kb/panels/concepts/detail/media/MediaView'
import NoMedia from '@/components/kb/panels/concepts/detail/media/NoMedia'

import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptMedia = () => {
  const {
    stagedState: { media },
  } = use(ConceptContext)

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
