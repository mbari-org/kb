import { use } from 'react'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BsInfoCircle } from 'react-icons/bs'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldBorder } from '@/lib/kb/model/field'

import { fieldPending } from '@/lib/kb/model/history'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

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

  return (
    <>
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
          alt={`Unable to Display Media: ${mediaItem?.url}`}
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
        {mediaItem?.credit && (
          <Tooltip
            title={mediaItem?.credit}
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                },
              },
            }}
          >
            <IconButton
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: 0,
                marginLeft: 1,
                '&:hover': {
                  ...theme.kb.icon.hover,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <BsInfoCircle size='18' />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  )
}

export default MediaPreview
