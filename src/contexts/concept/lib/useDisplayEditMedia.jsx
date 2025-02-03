import { use, useCallback, useRef } from "react"

import AddMediaActions from "@/components/kb/panels/concepts/media/editMedia/AddMediaActions"

import DeleteMediaActions from "@/components/kb/panels/concepts/media/editMedia/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/editMedia/DeleteMediaContent"

import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/EditMediaActions"
import EditMediaTitle from "@/components/kb/panels/concepts/media/editMedia/EditMediaTitle"

import { createModal } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"
import EditMediaForm from "@/components/kb/panels/concepts/media/editMedia/EditMediaForm"

import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

const useDisplayEditMedia = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    (action, mediaIndex) => {
      const Title = () => <EditMediaTitle action={action} />

      let modal
      switch (action) {
        case CONCEPT_STATE.ADD_MEDIA:
          modal = createModal({
            Actions: () => <AddMediaActions />,
            Content: () => <EditMediaForm mediaIndex={mediaIndex} />,
            Title,
          })
          break
        case CONCEPT_STATE.DELETE_MEDIA:
          modal = createModal({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title,
          })

          break
        case CONCEPT_STATE.EDIT_MEDIA: {
          modal = createModal({
            Actions: () => <EditMediaActions />,
            Content: () => <EditMediaForm mediaIndex={mediaIndex} />,
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
