import { use, useCallback } from "react"

import ErrorActions from "@/components/kb/error/ErrorActions"
import ErrorContent from "@/components/kb/error/ErrorContent"
import ErrorTitle from "@/components/kb/Error/ErrorTitle"
import { createModal } from "@/components/modal/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const useProcessError = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    error => {
      const modal = createModal({
        Actions: ErrorActions,
        Content: () => <ErrorContent error={error} />,
        Title: ErrorTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useProcessError
