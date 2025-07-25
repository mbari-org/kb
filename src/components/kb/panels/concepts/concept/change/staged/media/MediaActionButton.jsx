import { use, useCallback } from 'react'

import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import createEditMediaModal from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaModal'
import createEditMediaOnClose from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaOnClose'

import {
  EMPTY_MEDIA_ITEM,
  mediaItemFields,
} from '@/components/kb/panels/concepts/concept/change/staged/media/edit/mediaItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const MediaActionButton = ({ Icon, action, color, position = 'right', sx = {} }) => {
  const theme = useTheme()

  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const handleClick = useCallback(() => {
    const mediaIndex =
      action === CONCEPT_STATE.MEDIA_ITEM.ADD ? stagedState.media.length : stagedState.mediaIndex
    const stagedMediaItem = stagedState.media[mediaIndex]
    const mediaItem = stagedMediaItem ? mediaItemFields(stagedMediaItem) : EMPTY_MEDIA_ITEM

    const modalData = {
      action,
      mediaIndex,
      mediaItem,
      modified: false,
    }
    setModalData(modalData)

    const modal = createEditMediaModal(action)
    const onClose = createEditMediaOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, stagedState, initialState, modifyConcept, setModal, setModalData])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        bottom: 28,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        [position]: 2,
        position: 'absolute',
        zIndex: 1,
        ...sx,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
            color: `${color}.main`,
            transform: 'scale(1.25)',
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <Icon />
      </IconButton>
    </Box>
  )
}

export default MediaActionButton
