import { use, useCallback } from "react"

import EditingStateActions from "@/components/kb/panels/concepts/detail/editingState/EditingStateActions"
import EditingStateContent from "@/components/kb/panels/concepts/detail/editingState/EditingStateContent"
import EditingStateTitle from "@/components/kb/panels/concepts/detail/editingState/EditingStateTitle"

import { createModal } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayEditingState = () => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: EditingStateActions,
      Content: EditingStateContent,
      Title: EditingStateTitle,
    })
    setModal(modal)
  }, [setModal])
}

export default useDisplayEditingState
