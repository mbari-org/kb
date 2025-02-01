import { use, useCallback, useRef } from "react"

import AddMediaActions from "@/components/kb/panels/concepts/media/editMedia/add/AddMediaActions"
import AddMediaContent from "@/components/kb/panels/concepts/media/editMedia/add/AddMediaContent"

import DeleteMediaActions from "@/components/kb/panels/concepts/media/editMedia/delete/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/editMedia/delete/DeleteMediaContent"

import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/edit/EditMediaActions"
import EditMediaContent from "@/components/kb/panels/concepts/media/editMedia/edit/EditMediaContent"
import EditMediaTitle from "@/components/kb/panels/concepts/media/editMedia/EditMediaTitle"

import { createAlert } from "@/components/kb/factory"

import { MEDIA_STATE } from "@/lib/kb/concept/media"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayEditMedia = () => {
  const { setAlert } = use(ModalContext)
  const formRef = useRef(null)

  return useCallback(
    (action, mediaIndex) => {
      let alert

      const Title = () => <EditMediaTitle action={action} />

      switch (action) {
        case MEDIA_STATE.ADD:
          alert = createAlert({
            Actions: () => (
              <AddMediaActions mediaIndex={mediaIndex} formRef={formRef} />
            ),
            Content: () => (
              <AddMediaContent mediaIndex={mediaIndex} formRef={formRef} />
            ),
            Title,
          })
          break
        case MEDIA_STATE.DELETE:
          alert = createAlert({
            Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
            Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
            Title,
          })

          break
        case MEDIA_STATE.EDIT: {
          alert = createAlert({
            Actions: () => <EditMediaActions mediaIndex={mediaIndex} />,
            Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
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
