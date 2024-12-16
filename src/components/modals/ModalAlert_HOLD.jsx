import { use } from "react"

import ModalConfirm from "./ModalConfirm"
import ModalError from "./ModalError"
import ModalTitledBox from "./ModalTitledBox"
import ModalWarning from "./ModalWarning"

import ModalContext from "@/contexts/modal/ModalContext"

const ModalAlert_HOLD = () => {
  const { modalAlert } = use(ModalContext)

  if (!modalAlert) {
    return null
  }

  let ModalComponent
  switch (modalAlert.type) {
    case "confirm":
      ModalComponent = ModalConfirm
      break
    case "error":
      ModalComponent = ModalError
      break
    case "warning":
      ModalComponent = ModalWarning
      break
    default:
      ModalComponent = ModalError
  }

  return (
    <ModalTitledBox open={!!modalAlert} modalAlert={modalAlert}>
      <ModalComponent modalAlert={modalAlert} />
    </ModalTitledBox>
  )
}

export default ModalAlert_HOLD
