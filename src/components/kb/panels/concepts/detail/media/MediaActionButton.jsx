import { use, useCallback, useEffect, useState } from 'react'

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

  const { confirmReset, editingState, initialState, modifyConcept } = use(ConceptContext)
  const { closeModal, setModal, setModalData } = use(ModalContext)

  const [buttonAction, setButtonAction] = useState(action)

  const handleClick = useCallback(() => {
    const mediaIndex =
      buttonAction === CONCEPT_STATE.MEDIA.ADD ? editingState.media.length : editingState.mediaIndex

    const editingMediaItem = editingState.media[mediaIndex]
    const mediaItem = editingMediaItem ? mediaItemFields(editingMediaItem) : EMPTY_MEDIA_ITEM

    const actionModalData = {
      action: buttonAction,
      mediaIndex,
      mediaItem,
      modified: false,
    }

    setModalData(actionModalData)

    const setMediaData = update => {
      setModalData(prev => ({
        ...prev,
        ...update,
      }))
    }

    const modal = createEditMediaModal(buttonAction, setMediaData)
    const onClose = createEditMediaOnClose({
      closeModal,
      confirmReset,
      editingState,
      initialState,
      modifyConcept,
      setMediaData,
    })

    setModal(modal, onClose)
  }, [
    buttonAction,
    confirmReset,
    editingState,
    initialState,
    modifyConcept,
    closeModal,
    setModal,
    setModalData,
  ])

  useEffect(() => {
    setButtonAction(action)
  }, [action])

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
