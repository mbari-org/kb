import { use, useCallback, useEffect, useRef, useState } from 'react'
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
  const theme = useTheme()

  const { editing, editingState } = use(ConceptContext)

  const mediaViewRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewOn, setPreviewOn] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState('auto')

  const showEditMedia =
    editing && editingState.media[mediaIndex]?.action !== CONCEPT_STATE.MEDIA.DELETE

  const handleMediaIndexChange = useCallback(
    mediaIndex => {
      editingState.mediaIndex = mediaIndex
      setMediaIndex(mediaIndex)
    },
    [editingState, setMediaIndex]
  )

  useEffect(() => {
    if (mediaViewRef.current) {
      const width = mediaViewRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [editingState.media])

  useEffect(() => {
    if (editingState.mediaIndex !== mediaIndex) {
      setMediaIndex(editingState.mediaIndex)
    }
  }, [editingState.mediaIndex, mediaIndex])

  return (
    <>
      <Box ref={mediaViewRef} sx={{ position: 'relative' }}>
        <MediaPreview mediaIndex={mediaIndex} setPreviewOn={setPreviewOn} />
        <MediaDisplay
          mediaIndex={mediaIndex}
          previewOn={previewOn}
          setMediaIndex={handleMediaIndexChange}
          setPreviewOn={setPreviewOn}
        />
        {showEditMedia && (
          <>
            <MediaDelete mediaIndex={mediaIndex} />
            <MediaEdit mediaIndex={mediaIndex} />
          </>
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: 'relative', overflow: 'visible' }}>
        <MediaSwiper height={swiperHeight} setMediaIndex={handleMediaIndexChange} />
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            mediaIndex={editingState.media.length}
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
