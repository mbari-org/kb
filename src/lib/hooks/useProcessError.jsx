import { use, useCallback } from "react"

import ErrorActions from "@/components/kb/error/ErrorActions"
import ErrorContent from "@/components/kb/error/ErrorContent"
import ErrorTitle from "@/components/kb/Error/ErrorTitle"
import { createAlert } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useProcessError = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    error => {
      const alert = createAlert({
        Actions: ErrorActions,
        Content: () => <ErrorContent error={error} />,
        Title: ErrorTitle,
      })
      setAlert(alert)
    },
    [setAlert]
  )
}

export default useProcessError
