import { use, useCallback } from "react"

import { createModal } from "@/components/kb/factory"
import PendingFieldActions from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldActions"
import PendingFieldContent from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldContent"
import PendingFieldTitle from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldTitle"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayPendingField = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    field => {
      const modal = createModal({
        Actions: () => <PendingFieldActions field={field} />,
        Content: () => <PendingFieldContent field={field} />,
        Title: PendingFieldTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayPendingField
