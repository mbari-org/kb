import { use, useRef, useState } from 'react'
import { Box } from '@mui/material'

import MediaDisplay from '@/components/kb/panels/concepts/concept/detail/media/MediaDisplay'
import MediaPreview from '@/components/kb/panels/concepts/concept/detail/media/MediaPreview'
import MediaSwiper from '@/components/kb/panels/concepts/concept/detail/media/MediaSwiper'

import MediaAdd from '@/components/kb/panels/concepts/concept/change/staged/media/edit/MediaAdd'
import MediaDelete from '@/components/kb/panels/concepts/concept/change/staged/media/delete/MediaDelete'
import MediaEdit from '@/components/kb/panels/concepts/concept/change/staged/media/edit/MediaEdit'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const MediaView = () => {
  const mediaViewRef = useRef(null)

  const { isEditing, stagedState } = use(ConceptContext)
  const { media, mediaIndex } = stagedState

  const [previewOn, setPreviewOn] = useState(false)

  const showAddMedia = isEditing
  const showEditDeleteMedia = isEditing && !media[mediaIndex]?.historyId

  return (
    <Box>
      <Box ref={mediaViewRef} sx={{ position: 'relative' }}>
        <MediaPreview setPreviewOn={setPreviewOn} />
        <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} />
        {showAddMedia && (
          <Box>
            {showEditDeleteMedia && <MediaDelete />}
            <MediaAdd
              sx={{
                bottom: 20,
                left: '50%',
                position: 'absolute',
                transform: 'translateX(-50%)',
              }}
            />
            {showEditDeleteMedia && <MediaEdit />}
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
