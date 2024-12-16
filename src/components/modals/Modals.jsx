import { use } from "react"

import LoadingBackdrop from "./LoadingBackdrop"
import ModalAlert from "./ModalAlert"

import ModalContext from "@/contexts/modal/ModalContext"

const Modals = () => {
  const { loading, modalAlert } = use(ModalContext)

  return (
    <>
      {loading && <LoadingBackdrop loading={loading} />}
      {modalAlert && <ModalAlert modalAlert={modalAlert} />}
    </>
  )
}

export default Modals
