import { use, useCallback } from 'react'

import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import createEditMediaModal from '@/components/kb/panels/concepts/detail/media/edit/createEditMediaModal'
import createEditMediaOnClose from '@/components/kb/panels/concepts/detail/media/edit/createEditMediaOnClose'

import {
  EMPTY_MEDIA_ITEM,
  mediaItemFields,
} from '@/components/kb/panels/concepts/detail/media/edit/mediaItem'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MediaActionButton = ({ Icon, action, color, position = 'right', sx = {} }) => {
  const theme = useTheme()

  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ModalContext)

  const handleClick = useCallback(() => {
    const mediaIndex =
      action === CONCEPT_STATE.MEDIA.ADD ? stagedState.media.length : stagedState.mediaIndex
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
        color={color}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
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
