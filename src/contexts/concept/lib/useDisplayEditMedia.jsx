import { use, useCallback, useRef } from "react"

import AddMediaActions from "@/components/kb/panels/concepts/media/editMedia/add/AddMediaActions"
import AddMediaContent from "@/components/kb/panels/concepts/media/editMedia/add/AddMediaContent"

import DeleteMediaActions from "@/components/kb/panels/concepts/media/editMedia/delete/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/editMedia/delete/DeleteMediaContent"

import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/edit/EditMediaActions"
import EditMediaContent from "@/components/kb/panels/concepts/media/editMedia/edit/EditMediaContent"
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
  const formRef = useRef(null)

  return useCallback(
    (action, mediaIndex) => {
      let alert

      switch (action) {
        case MEDIA_ACTIONS.ADD:
          alert = createAlert({
            Actions: () => (
              <AddMediaActions mediaIndex={mediaIndex} formRef={formRef} />
            ),
            Content: () => (
              <AddMediaContent mediaIndex={mediaIndex} formRef={formRef} />
            ),
            Title: EditMediaTitle,
          })
          break
        case MEDIA_ACTIONS.DELETE:
          alert = createAlert({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title: EditMediaTitle,
          })

          break
        case MEDIA_ACTIONS.EDIT: {
          alert = createAlert({
            Actions: () => <EditMediaActions mediaIndex={mediaIndex} />,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
            Title: EditMediaTitle,
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
