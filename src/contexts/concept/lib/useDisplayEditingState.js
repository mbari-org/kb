import { use, useCallback } from "react"

import { createAlert } from "@/components/factory"
import EditingStateActions from "@/components/kb/panels/concepts/detail/editingState/EditingStateActions"
import EditingStateContent from "@/components/kb/panels/concepts/detail/editingState/EditingStateContent"
import EditingStateTitle from "@/components/kb/panels/concepts/detail/editingState/EditingStateTitle"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayEditingState = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(() => {
    const alert = createAlert({
      Actions: EditingStateActions,
      Content: EditingStateContent,
      Title: EditingStateTitle,
    })
    setAlert(alert)
  }, [setAlert])
}

export default useDisplayEditingState
