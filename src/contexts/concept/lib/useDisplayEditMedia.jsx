import { use, useCallback } from "react"

import DeleteMediaActions from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaContent"
import DeleteMediaTitle from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaTitle"

import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/EditMediaActions"
import EditMediaContent from "@/components/kb/panels/concepts/media/editMedia/EditMediaContent"
import EditMediaTitle from "@/components/kb/panels/concepts/media/editMedia/EditMediaTitle"

import { createAlert } from "@/components/factory"

import ModalContext from "@/contexts/modal/ModalContext"

export const MEDIA_ACTIONS = {
  ADD: "Add",
  DELETE: "Delete",
  EDIT: "Edit",
}

const useDisplayEditMedia = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    (action, mediaIndex) => {
      let alert

      switch (action) {
        case MEDIA_ACTIONS.ADD:
          alert = createAlert({
            Actions: () => <EditMediaActions mediaIndex={mediaIndex} />,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
            Title: EditMediaTitle,
          })
          break
        case MEDIA_ACTIONS.DELETE:
          alert = createAlert({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title: DeleteMediaTitle,
          })

          break
        case MEDIA_ACTIONS.EDIT:
          alert = createAlert({
            Actions: () => <EditMediaActions mediaIndex={mediaIndex} />,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
            Title: EditMediaTitle,
          })

          break
      }

      setAlert(alert)
    },
    [setAlert]
  )
}

export default useDisplayEditMedia
