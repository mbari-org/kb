import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE, FIELDS } from '@/lib/kb/concept/state/conceptState'

import { isValidUrl } from '@/lib/util'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

const CONFIRM_DISCARD = 'Confirm Discard'
const DISCARD = 'Discard'
const STAGE = 'Stage'

const EditMediaActions = () => {
  const { confirmReset, editingState, initialState, isModified, modifyConcept } =
    use(ConceptContext)
  const { MODAL_X, setModal } = use(ModalContext)

  const { mediaIndex } = editingState

  const editingMediaItem = editingState.media[mediaIndex]
  const initialMediaItem = initialState.media[mediaIndex]

  const noChange = !isModified(FIELDS.MEDIA, mediaIndex)

  const validMediaItem = isValidUrl(editingMediaItem.url) && editingMediaItem.credit.trim() !== ''

  const colors = ['cancel', 'main']
  const disabled = [false, noChange && validMediaItem]
  const labels = [confirmReset ? CONFIRM_DISCARD : DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.YES })
        setModal(null)
        break

      case DISCARD:
        noChange
          ? setModal(MODAL_X)
          : modifyConcept({
              type: CONCEPT_STATE.RESET.MEDIA_ITEM,
              update: { mediaIndex, mediaItem: initialMediaItem },
            })
        break

      case STAGE:
        document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
        break

      default:
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptEditMediaActions')
}

export default EditMediaActions
