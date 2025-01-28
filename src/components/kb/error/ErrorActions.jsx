import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const RESET = "Reset"

const ErrorActions = () => {
  const { setAlert } = use(ModalContext)

  const colors = ["main"]
  const labels = [RESET]

  const onAction = () => {
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ErrorActions")
}

export default ErrorActions
