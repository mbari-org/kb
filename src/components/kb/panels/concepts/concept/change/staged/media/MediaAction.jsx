import { use, useCallback, useState } from 'react'

import MediaIcon from '@/components/icon/MediaIcon'
import createEditMediaModal from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaModal'
import createEditMediaOnClose from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaOnClose'

import {
  EMPTY_MEDIA_ITEM,
  mediaItemFields,
} from '@/components/kb/panels/concepts/concept/change/staged/media/edit/mediaItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const MediaAction = ({ Icon, action, color, position = 'right', size, tooltip, sx = {} }) => {
  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { mediaBaseUrl } = use(ConfigContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const [asyncError, setAsyncError] = useState(null)

  if (asyncError) {
    throw asyncError
  }

  const handleClick = useCallback(() => {
    try {
      const mediaIndex =
        action === CONCEPT_STATE.MEDIA_ITEM.ADD ? stagedState.media.length : stagedState.mediaIndex
      const stagedMediaItem = stagedState.media[mediaIndex]
      const mediaItem = stagedMediaItem
        ? mediaItemFields(stagedMediaItem)
        : action === CONCEPT_STATE.MEDIA_ITEM.ADD
          ? { ...EMPTY_MEDIA_ITEM, url: mediaBaseUrl || '' }
          : EMPTY_MEDIA_ITEM

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
    } catch (error) {
      setAsyncError(error)
    }
  }, [action, mediaBaseUrl, stagedState, initialState, modifyConcept, setModal, setModalData])

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
