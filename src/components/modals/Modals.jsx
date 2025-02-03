import { use } from "react"

import Modal from "../modal/Modal"
import LoadingBackdrop from "./LoadingBackdrop"

import ModalContext from "@/contexts/modal/ModalContext"

const Modals = () => {
  const { loading, modal } = use(ModalContext)

  return (
    <>
      {modal && <Modal modal={modal} />}
      {loading && <LoadingBackdrop loading={loading} />}
    </>
  )
}

export default Modals
