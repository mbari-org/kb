import { use } from "react"

import { createActions } from "@/components/modal/factory"

import ModalContext from "@/contexts/modal/ModalContext"

import { EDIT_MEDIA_FORM_ID } from "./EditMediaContent"

const DISCARD = "Discard"
const SAVE = "Save"

const EditMediaActions = () => {
  const { data, setModal } = use(ModalContext)

  const colors = ["cancel", "main"]
  const disabled = [false, !data?.dirty]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    label === SAVE
      ? document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
      : setModal(null)
  }

  return createActions(
    { colors, disabled, labels, onAction },
    "ConceptEditMediaActions"
  )
}

export default EditMediaActions
