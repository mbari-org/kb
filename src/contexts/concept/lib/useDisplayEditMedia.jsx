import { use, useCallback } from 'react'

import AddMediaActions from '@/components/kb/panels/concepts/detail/media/add/AddMediaActions'

import DeleteMediaActions from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaActions'
import DeleteMediaContent from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaContent'

import EditMediaActions from '@/components/kb/panels/concepts/detail/media/edit/EditMediaActions'
import EditMediaContent from '@/components/kb/panels/concepts/detail/media/edit/EditMediaContent'

import EditMediaTitle from '@/components/kb/panels/concepts/detail/media/edit/EditMediaTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const useDisplayEditMedia = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    (action, mediaIndex) => {
      const Title = () => <EditMediaTitle action={action} />

      let modal
      switch (action) {
        case CONCEPT_STATE.MEDIA_ADD:
          modal = createModal({
            Actions: () => <AddMediaActions />,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
            Title,
          })
          break

        case CONCEPT_STATE.MEDIA_DELETE:
          modal = createModal({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title,
          })
          break

        case CONCEPT_STATE.MEDIA_EDIT: {
          modal = createModal({
            Actions: EditMediaActions,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
            Title,
          })
          break
        }
      }

      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayEditMedia
