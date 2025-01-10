import { use, useCallback } from "react"

import ModalContext from "@/contexts/modal/ModalContext"

import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
} from "@/components/modals/alert/components"

const useProcessError = () => {
  const { setModalAlert } = use(ModalContext)

  return useCallback(
    (error, onContinue) => {
      setModalAlert({
        Title: createAlertTitle({
          title: "Process Error",
          type: "error",
        }),
        Content: createAlertContentText({
          text: error.message,
          type: "error",
        }),
        Choices: createAlertButtons({
          choices: ["Continue"],
          colors: ["cancel"],
          onChoice: onContinue,
        }),
      })
    },
    [setModalAlert]
  )
}

export default useProcessError
