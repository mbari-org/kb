import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/icon/property/PropertyEditIcon'

import createEditMediaModal from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaModal'
import createEditMediaOnClose from '@/components/kb/panels/concepts/concept/change/staged/media/edit/createEditMediaOnClose'

import {
  EMPTY_MEDIA_ITEM,
  mediaItemFields,
} from '@/components/kb/panels/concepts/concept/change/staged/media/edit/mediaItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const ADD = CONCEPT_STATE.MEDIA_ITEM.ADD
const DELETE = CONCEPT_STATE.MEDIA_ITEM.DELETE

const MediaModifyIcon = ({ action, mediaIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const onClick = useCallback(() => {
    const mediaItem =
      action === ADD ? EMPTY_MEDIA_ITEM : mediaItemFields(stagedState.media[mediaIndex])

    const actionModalData = {
      action,
      mediaItem,
      mediaIndex,
      modified: false,
    }
    setModalData(actionModalData)

    const modal = createEditMediaModal(action)
    const onClose = createEditMediaOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, mediaIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  const IconComponent =
    action === ADD ? PropertyAddIcon : action === DELETE ? PropertyDeleteIcon : PropertyEditIcon

  return <IconComponent onClick={onClick} size={size} />
}

export default MediaModifyIcon
