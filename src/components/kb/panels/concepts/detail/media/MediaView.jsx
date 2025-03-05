import { use, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import MediaAdd from './add/MediaAdd'
import MediaDelete from './delete/MediaDelete'
import MediaDisplay from './MediaDisplay'
import MediaEdit from './edit/MediaEdit'
import MediaPreview from './MediaPreview'
import MediaSwiper from './MediaSwiper'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import ConceptContext from '@/contexts/concept/ConceptContext'

const MediaView = () => {
  const mediaViewRef = useRef(null)

  const theme = useTheme()

  const { editing, editingState } = use(ConceptContext)
  const { media, mediaIndex } = editingState

  const [previewOn, setPreviewOn] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState('auto')

  const showEditMedia = editing && media[mediaIndex]?.action !== CONCEPT_STATE.MEDIA.DELETE

  useEffect(() => {
    if (mediaViewRef.current) {
      const width = mediaViewRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <>
      <Box ref={mediaViewRef} sx={{ position: 'relative' }}>
        <MediaPreview setPreviewOn={setPreviewOn} />
        <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} />
        {showEditMedia && (
          <>
            <MediaDelete />
            <MediaEdit />
          </>
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: 'relative', overflow: 'visible' }}>
        <MediaSwiper height={swiperHeight} />
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            sx={{
              mt: 1,
            }}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
