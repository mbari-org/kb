import { use, useCallback } from 'react'

import MediaIcon from '@/components/icon/MediaIcon'
import createEditMediaModal from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaModal'
import createEditMediaOnClose from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaOnClose'

import {
  EMPTY_MEDIA_ITEM,
  mediaItemFields,
} from '@/components/kb/panels/concepts/concept/change/staged/media/edit/mediaItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const MediaAction = ({ Icon, action, color, position = 'right', size, tooltip, sx = {} }) => {
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
    <MediaIcon
      Icon={Icon}
      color={color}
      position={position}
      size={size}
      tooltip={tooltip}
      onClick={handleClick}
      sx={sx}
    />
  )
}

export default MediaAction
