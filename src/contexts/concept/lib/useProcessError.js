import { use, useCallback } from "react"

import ModalContext from "@/contexts/modal/ModalContext"

import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
} from "@/components/modals/alert/components"

const useProcessError = (initialState, reset) => {
  const { setModalAlert } = use(ModalContext)

  return useCallback(
    error => {
      setModalAlert({
        Title: createAlertTitle({
          title: "Update Error",
          type: "error",
        }),
        Content: createAlertContentText({
          text: error.message,
          type: "error",
        }),
        Choices: createAlertButtons({
          choices: ["Continue"],
          colors: ["cancel"],
          onChoice: () => {
            reset(initialState)
          },
        }),
      })
    },
    [initialState, reset, setModalAlert]
  )
}

export default useProcessError
