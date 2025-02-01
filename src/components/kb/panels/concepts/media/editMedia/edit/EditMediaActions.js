import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const DISCARD = "Discard"
const SAVE = "Save"

const EditMediaActions = ({ formRef }) => {
  const { data, setAlert } = use(ModalContext)

  const colors = ["cancel", "main"]
  const disabled = [false, !data?.dirty]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      if (formRef.current) {
        formRef.current.submitForm()
      }
    } else {
      setAlert(null)
    }
  }

  return createActions(
    { colors, disabled, labels, onAction },
    "ConceptEditMediaActions"
  )
}

export default EditMediaActions
