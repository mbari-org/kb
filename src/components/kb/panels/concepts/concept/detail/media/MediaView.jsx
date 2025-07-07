import { use, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import MediaDisplay from '@/components/kb/panels/concepts/concept/detail/media/MediaDisplay'
import MediaPreview from '@/components/kb/panels/concepts/concept/detail/media/MediaPreview'
import MediaSwiper from '@/components/kb/panels/concepts/concept/detail/media/MediaSwiper'

import MediaAdd from '@/components/kb/panels/concepts/concept/change/staged/concept/media/edit/MediaAdd'
import MediaDelete from '@/components/kb/panels/concepts/concept/change/staged/concept/media/delete/MediaDelete'
import MediaEdit from '@/components/kb/panels/concepts/concept/change/staged/concept/media/edit/MediaEdit'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const MediaView = () => {
  const mediaViewRef = useRef(null)

  const theme = useTheme()

  const { editing, stagedState } = use(ConceptContext)
  const { media, mediaIndex } = stagedState

  const [previewOn, setPreviewOn] = useState(false)

  // const showEditMedia = editing && media[mediaIndex]?.action !== CONCEPT_STATE.MEDIA.DELETE
  const showEditMedia = editing && !media[mediaIndex]?.historyId

  return (
    <Box>
      <Box ref={mediaViewRef} sx={{ position: 'relative' }}>
        <MediaPreview setPreviewOn={setPreviewOn} />
        <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} />
        {showEditMedia && (
          <Box>
            <MediaDelete />
            {editing && (
              <MediaAdd
                bgColor={theme.palette.background.paperLight}
                sx={{
                  position: 'absolute',
                  bottom: 28,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                  mb: 1.25,
                }}
              />
            )}
            <MediaEdit />
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: 'relative', overflow: 'visible' }}>
        <MediaSwiper height='auto' />
      </Box>
    </Box>
  )
}

export default MediaView
