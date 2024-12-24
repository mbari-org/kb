import { use, useCallback } from "react"

import { useTheme } from "@mui/material/styles"

import ModalContext from "@/contexts/modal/ModalContext"

import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
} from "@/components/modals/alert/components"

const useProcessError = (initialState, reset) => {
  const { setModalAlert } = use(ModalContext)
  const theme = useTheme()

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
          colors: [theme.color.cancel],
          onChoice: () => {
            reset(initialState)
          },
        }),
      })
    },
    [initialState, reset, setModalAlert, theme]
  )
}

export default useProcessError
