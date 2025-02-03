import { use, useCallback } from "react"

import ChangeNameActions from "./ChangeNameActions"
import ChangeNameContent from "./ChangeNameContent"
import ChangeNameTitle from "./ChangeNameTitle"

import { createModal } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useChangeName = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: ChangeNameActions,
      Content: ChangeNameContent,
      Title: ChangeNameTitle,
    })
    onClose()
    setModal(modal)
  }, [onClose, setModal])
}

export default useChangeName
