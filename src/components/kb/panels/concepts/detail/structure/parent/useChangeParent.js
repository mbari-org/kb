import { use, useCallback } from "react"

import ParentActions from "./ParentActions"
import ParentContent from "./ParentContent"
import ParentTitle from "./ParentTitle"

import { createModal } from "@/components/modal/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useChangeParent = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: ParentActions,
      Content: ParentContent,
      Title: ParentTitle,
    })
    onClose()
    setModal(modal)
  }, [onClose, setModal])
}

export default useChangeParent
