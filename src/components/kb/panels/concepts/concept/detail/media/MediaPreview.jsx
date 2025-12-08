import { use } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import KBInfoIcon from '@/components/icon/KBInfoIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isPendingMedia } from '@/lib/kb/state/media'
import { stagedBorder } from '@/lib/kb/state/staged'

import { PENDING } from '@/constants/pending.js'

const MediaPreview = ({ setPreviewOn }) => {
  const theme = useTheme()

  const { pending } = use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  const { stagedState } = use(ConceptContext)
  const { media, mediaIndex } = stagedState
  const mediaItem = media[mediaIndex]

  const pendingMedia = pendingConcept.filter(isPendingMedia)
  const border = stagedBorder({
    itemPending: pendingMedia,
    noActionBorderColor: theme.palette.grey[300],
    stagedItem: mediaItem,
    theme,
    width: '3px',
  })

  return (
    <Stack>
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
          alt={'Unable to display Media! Check console for URL.'}
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
          marginTop: 1,
          minHeight: '24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          align='center'
          sx={{
            textAlign: 'center',
          }}
          variant='caption'
        >
          {mediaItem?.caption}
        </Typography>
        {mediaItem?.credit && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <KBInfoIcon tooltip={mediaItem?.credit} placement='top' size={18} />
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default MediaPreview
