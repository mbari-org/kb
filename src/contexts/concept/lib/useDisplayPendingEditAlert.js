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
      console.log("field", field)
      console.log("pendingHistory", pendingHistory)
      const fieldPendingHistory = getFieldPendingHistory(pendingHistory, field)
      console.log("fieldPendingHistory", fieldPendingHistory)

      const pendingEdit = pickFields(fieldPendingHistory, [
        "action",
        "creationTimestamp",
        "creatorName",
        "newValue",
        "oldValue",
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
        Title: createAlertTitle({ title: `Pending Edit: ${conceptName}` }),
        Content: createAlertContentPendingEdit(pendingEdit),
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
