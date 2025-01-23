import { use, useCallback } from "react"

import { createAlert } from "@/components/factory"
import EditMediaActions from "@/components/kb/panels/concepts/media/editMedia/EditMediaActions"
import EditMediaContent from "@/components/kb/panels/concepts/media/editMedia/EditMediaContent"
import EditMediaTitle from "@/components/kb/panels/concepts/media/editMedia/EditMediaTitle"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayEditMedia = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    field => {
      const alert = createAlert({
        Actions: EditMediaActions,
        Content: () => <EditMediaContent field={field} />,
        Title: EditMediaTitle,
      })
      setAlert(alert)
    },
    [setAlert]
  )
}

export default useDisplayEditMedia
