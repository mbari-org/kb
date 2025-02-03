import { use, useCallback } from "react"

import ChangeParentActions from "./ChangeParentActions"
import ChangeParentContent from "./ChangeParentContent"
import ChangeParentTitle from "./ChangeParentTitle"

import { createModal } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useChangeParent = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: ChangeParentActions,
      Content: ChangeParentContent,
      Title: ChangeParentTitle,
    })
    onClose()
    setModal(modal)
  }, [onClose, setModal])
}

export default useChangeParent
