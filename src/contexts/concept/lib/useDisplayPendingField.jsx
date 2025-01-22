import { use, useCallback } from "react"

import { createAlert } from "@/components/factory"
import PendingFieldActions from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldActions"
import PendingFieldContent from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldContent"
import PendingFieldTitle from "@/components/kb/panels/concepts/detail/pendingField/PendingFieldTitile"

import ModalContext from "@/contexts/modal/ModalContext"

const useDisplayPendingField = () => {
  const { setAlert } = use(ModalContext)

  return useCallback(
    field => {
      const alert = createAlert({
        Actions: PendingFieldActions,
        Content: () => <PendingFieldContent field={field} />,
        Title: PendingFieldTitle,
      })
      setAlert(alert)
    },
    [setAlert]
  )
}

export default useDisplayPendingField
