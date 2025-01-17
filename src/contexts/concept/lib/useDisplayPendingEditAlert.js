import { use, useCallback } from "react"

import {
  createAlertButtons,
  createAlertContentPendingEdit,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ModalContext from "@/contexts/modal/ModalContext"

import { getFieldPendingHistory, pickFields } from "@/lib/kb/util"

const ACCEPT = "Accept"
const DEFER = "Defer"
const REJECT = "Reject"

const useDisplayPendingEditAlert = ({ conceptName, pendingHistory }) => {
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
            break
          case DEFER:
            break
          case ACCEPT:
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
          choices: [REJECT, DEFER, ACCEPT],
          colors: ["cancel", "main", "clean"],
          onChoice,
        }),
      })
    },
    [conceptName, pendingHistory, setModalAlert]
  )

  return displayPendingEditAlert
}

export default useDisplayPendingEditAlert
