import { use, useCallback } from "react"

import NameActions from "./NameActions"
import NameContent from "./NameContent"
import NameTitle from "./NameTitle"

import { createModal } from "@/components/modal/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useChangeName = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: NameActions,
      Content: NameContent,
      Title: NameTitle,
    })
    onClose()
    setModal(modal)
  }, [onClose, setModal])
}

export default useChangeName
