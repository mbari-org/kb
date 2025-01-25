import { use, useCallback } from "react"

import { createAlert } from "@/components/factory"
import DeleteMediaActions from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaActions"
import DeleteMediaContent from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaContent"
import DeleteMediaTitle from "@/components/kb/panels/concepts/media/deleteMedia/DeleteMediaTitle"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayDeleteMedia = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    mediaIndex => {
      const alert = createAlert({
        Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
        Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
        Title: DeleteMediaTitle,
      })
      setAlert(alert)
    },
    [setAlert]
  )
}

export default useDisplayDeleteMedia
