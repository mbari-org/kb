import { use, useCallback } from "react"

import EditingStateActions from "@/components/kb/panels/concepts/detail/editingState/EditingStateActions"
import EditingStateContent from "@/components/kb/panels/concepts/detail/editingState/EditingStateContent"
import EditingStateTitle from "@/components/kb/panels/concepts/detail/editingState/EditingStateTitle"

import { createModal } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

export const INTENT = {
  SAVE: "Save",
  SHOW: "Show",
}

const useDisplayEditingState = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <EditingStateActions intent={intent} />,
        Content: EditingStateContent,
        Title: EditingStateTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayEditingState
