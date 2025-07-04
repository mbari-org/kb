import { use } from 'react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import KBInfoIcon from '@/components/common/KBInfoIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { fieldBorder } from '@/lib/kb/model/field'

import { fieldPending } from '@/lib/kb/model/history'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { checkImageUrlExists, isUrlValid } from '@/lib/utils'

const MediaPreview = ({ setPreviewOn }) => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)

  const { stagedState } = use(ConceptContext)
  const { media, mediaIndex } = stagedState
  const mediaItem = media[mediaIndex]

  const mediaPending = fieldPending(conceptPending, 'Media').pop()

  const border = fieldBorder({
    itemPending: mediaPending,
    noActionBorderColor: theme.palette.grey[300],
    stagedItem: mediaItem,
    theme,
    width: '3px',
  })

  if (!isUrlValid(mediaItem?.url)) console.error('Invalid media URL:', mediaItem?.url)
  checkImageUrlExists(mediaItem?.url).then(exists => {
    if (!exists) console.error('Media image not found:', mediaItem?.url)
  })

  return (
    <Box>
      <Box
        sx={{
          border,
          height: '0',
          paddingBottom: '100%',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <img
          alt={`Unable to display Media! Check console for URL.`}
          onClick={() => setPreviewOn(true)}
          src={mediaItem?.url}
          style={{
            height: '100%',
            left: '50%',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            position: 'absolute',
            top: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          marginTop: 1,
          minHeight: '24px',
        }}
      >
        {mediaItem?.credit && (
          <Box sx={{ marginRight: 1 }}>
            <KBInfoIcon tooltip={mediaItem?.credit} placement='top' size={18} />
          </Box>
        )}
        <Typography
          align='center'
          sx={{
            flexGrow: 1,
            textAlign: 'center',
          }}
          variant='caption'
        >
          {mediaItem?.caption}
        </Typography>
      </Box>
    </Box>
  )
}

export default MediaPreview
