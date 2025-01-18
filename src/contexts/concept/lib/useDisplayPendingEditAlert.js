import { use, useCallback } from "react"

import {
  createAlertButtons,
  createAlertContentPendingEdit,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ConfigContext from "@/contexts/config/ConfigContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { getFieldPendingHistory, pickFields } from "@/lib/kb/util"
import { sendPendingAction } from "@/lib/services/oni/api/history"

const APPROVE = "Approve"
const DEFER = "Defer"
const REJECT = "Reject"

const useDisplayPendingEditAlert = ({ conceptName, pendingHistory }) => {
  const { config } = use(ConfigContext)
  const { setModalAlert } = use(ModalContext)

  const displayPendingEditAlert = useCallback(
    field => {
      const fieldPendingHistory = getFieldPendingHistory(pendingHistory, field)
      const pendingEdit = pickFields(fieldPendingHistory, [
        "action",
        ["oldValue", "before"],
        ["newValue", "after"],
        ["creatorName", "user"],
        ["creationTimestamp", "created"],
      ])

      const onChoice = choice => {
        switch (choice) {
          case REJECT:
            sendPendingAction(config, "reject", fieldPendingHistory.id)
            break
          case DEFER:
            break
          case APPROVE:
            sendPendingAction(config, "approve", fieldPendingHistory.id)
            break
          default:
            break
        }

        setModalAlert(null)
      }
      setModalAlert({
        Title: createAlertTitle({ title: `Concept: ${conceptName}` }),
        Content: createAlertContentPendingEdit({ field, pendingEdit }),
        Choices: createAlertButtons({
          choices: [REJECT, DEFER, APPROVE],
          colors: ["cancel", "main", "clean"],
          onChoice,
        }),
      })
    },
    [conceptName, config, pendingHistory, setModalAlert]
  )

  return displayPendingEditAlert
}

export default useDisplayPendingEditAlert
