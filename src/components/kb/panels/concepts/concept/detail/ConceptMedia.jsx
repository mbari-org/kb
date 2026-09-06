import { use } from 'react'
import { Box } from '@mui/material'

import MediaView from '@/components/kb/panels/concepts/concept/detail/media/MediaView'
import NoMedia from '@/components/kb/panels/concepts/concept/detail/media/NoMedia'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

const ConceptMedia = () => {
  const { stagedState } = use(ConceptStagedContext)
  const { media } = stagedState

  return (
    <Box
      sx={{
        flexBasis: '25%',
        flexShrink: 0,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {media?.length === 0 && <NoMedia />}
      {media?.length > 0 && <MediaView />}
    </Box>
  )
}

export default ConceptMedia
