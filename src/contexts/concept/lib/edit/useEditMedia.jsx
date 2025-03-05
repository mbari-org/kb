import { use, useCallback } from 'react'

import AddMediaActions from '@/components/kb/panels/concepts/detail/media/add/AddMediaActions'
import DeleteMediaActions from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaActions'
import DeleteMediaContent from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaContent'
import EditMediaActions from '@/components/kb/panels/concepts/detail/media/edit/EditMediaActions'
import EditMediaContent from '@/components/kb/panels/concepts/detail/media/edit/EditMediaContent'
import EditMediaTitle from '@/components/kb/panels/concepts/detail/media/edit/EditMediaTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE, FIELDS } from '@/lib/kb/concept/state/conceptState'

const useEditMedia = action => {
  const { confirmReset, editingState, isModified, modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const mediaIndex =
    action === CONCEPT_STATE.MEDIA.ADD ? editingState.media.length : editingState.mediaIndex

  const noChange = !isModified(FIELDS.MEDIA, mediaIndex)

  const Title = () => <EditMediaTitle action={action} />

  let components
  switch (action) {
    case CONCEPT_STATE.MEDIA.ADD: {
      components = {
        Actions: AddMediaActions,
        Content: () => <EditMediaContent action={action} />,
        Title,
      }
      break
    }

    case CONCEPT_STATE.MEDIA.DELETE: {
      components = {
        Actions: DeleteMediaActions,
        Content: DeleteMediaContent,
        Title,
      }
      break
    }

    case CONCEPT_STATE.MEDIA.EDIT: {
      components = {
        Actions: EditMediaActions,
        Content: () => <EditMediaContent action={action} />,

        Title,
      }
      break
    }
  }

  return useCallback(() => {
    const modal = createModal(components)
    const onClose = () => {
      if (noChange) {
        setModal(null)
        return
      }

      if (confirmReset) {
        modifyConcept({
          type: CONCEPT_STATE.RESET.CONFIRMED.YES,
        })
      } else {
        modifyConcept({
          type: CONCEPT_STATE.RESET.MEDIA_ITEM,
          update: { mediaIndex },
        })
      }
    }
    setModal(modal, onClose)
  }, [components, confirmReset, mediaIndex, modifyConcept, noChange, setModal])
}

export default useEditMedia
