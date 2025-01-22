import { use } from "react"

import Alert from "../alert/Alert"
import LoadingBackdrop from "./LoadingBackdrop"

import ModalContext from "@/contexts/modal/ModalContext"

const Modals = () => {
  const { loading, alert } = use(ModalContext)

  return (
    <>
      {alert && <Alert alert={alert} />}
      {loading && <LoadingBackdrop loading={loading} />}
    </>
  )
}

export default Modals
