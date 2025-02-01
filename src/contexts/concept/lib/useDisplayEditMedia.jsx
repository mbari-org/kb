import { use, useCallback, useRef } from "react"

import AddMediaActions from "@/components/kb/panels/concepts/media/editMedia/AddMediaActions"

import DeleteMediaActions from "@/components/kb/panels/concepts/media/editMedia/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/editMedia/DeleteMediaContent"

import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/EditMediaActions"
import EditMediaTitle from "@/components/kb/panels/concepts/media/editMedia/EditMediaTitle"

import { createAlert } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"
import EditMediaForm from "@/components/kb/panels/concepts/media/editMedia/EditMediaForm"

import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

const useDisplayEditMedia = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    (action, mediaIndex) => {
      const Title = () => <EditMediaTitle action={action} />

      let alert
      switch (action) {
        case CONCEPT_STATE.ADD_MEDIA:
          alert = createAlert({
            Actions: () => <AddMediaActions />,
            Content: () => <EditMediaForm mediaIndex={mediaIndex} />,
            Title,
          })
          break
        case CONCEPT_STATE.DELETE_MEDIA:
          alert = createAlert({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title,
          })

          break
        case CONCEPT_STATE.EDIT_MEDIA: {
          alert = createAlert({
            Actions: () => <EditMediaActions />,
            Content: () => <EditMediaForm mediaIndex={mediaIndex} />,
            Title,
          })

          break
        }
      }

      setAlert(alert)
    },
    [setAlert]
  )
}

export default useDisplayEditMedia
