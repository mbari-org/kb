import { use, useCallback } from "react"

import {
  createActions,
  createPendingEditContent,
  createTitle,
} from "@/components/alert/components"

import ConfigContext from "@/contexts/config/ConfigContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { getFieldPendingHistory, pickFields } from "@/lib/kb/util"
import { sendPendingAction } from "@/lib/services/oni/api/history"

const APPROVE = "Approve"
const DEFER = "Defer"
const REJECT = "Reject"

const useDisplayPendingEdit = ({ conceptName, pendingHistory }) => {
  const { config } = use(ConfigContext)
  const { setAlert } = use(ModalContext)

  const displayPendingEdit = useCallback(
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

        setAlert(null)
      }
      setAlert({
        Title: createTitle({ title: `Concept: ${conceptName}` }),
        Content: createPendingEditContent({
          field: fieldPendingHistory.field,
          pendingEdit,
        }),
        Actions: createActions({
          choices: [REJECT, DEFER, APPROVE],
          colors: ["cancel", "main", "clean"],
          onChoice,
        }),
      })
    },
    [conceptName, config, pendingHistory, setAlert]
  )

  return displayPendingEdit
}

export default useDisplayPendingEdit
