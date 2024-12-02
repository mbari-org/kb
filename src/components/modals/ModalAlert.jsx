import { use, useCallback } from "react"

import ModalError from "./ModalError"
import ModalTitledBox from "./ModalTitledBox"
import ModalWarning from "./ModalWarning"

import ModalContext from "@/contexts/modal/ModalContext"

const ModalAlert = () => {
  const { modalAlert, setModalAlert } = use(ModalContext)

  const onClose = useCallback(() => {
    setModalAlert(null)
  }, [setModalAlert])

  if (!modalAlert) {
    return null
  }

  return (
    <ModalTitledBox
      open={!!modalAlert}
      onClose={onClose}
      title={modalAlert.title}
    >
      {modalAlert.type === "error" && (
        <ModalError modalAlert={modalAlert} onClose={onClose} />
      )}
      {modalAlert.type === "warning" && (
        <ModalWarning modalAlert={modalAlert} onClose={onClose} />
      )}
    </ModalTitledBox>
  )
}

export default ModalAlert
