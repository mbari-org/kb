import { use, useCallback } from "react"

import ModalContext from "@/contexts/modal/ModalContext"

import {
  createActions,
  createTextContent,
  createTitle,
} from "@/components/factory"

const useProcessError = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    (error, onContinue) => {
      setAlert({
        Title: createTitle({
          title: "Processing Error",
          type: "error",
        }),
        Content: createTextContent({
          text: error.message,
          type: "error",
        }),
        Actions: createActions({
          choices: ["Continue"],
          colors: ["cancel"],
          onChoice: onContinue,
        }),
      })
    },
    [setAlert]
  )
}

export default useProcessError
