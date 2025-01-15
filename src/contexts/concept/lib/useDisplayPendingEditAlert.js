import { use, useCallback } from "react"

import {
  createAlertButtons,
  createAlertContentPendingEdit,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ModalContext from "@/contexts/modal/ModalContext"

const ACCEPT = "Accept"
const DEFER = "Defer"
const REJECT = "Reject"

const useDisplayPendingEditAlert = ({ conceptName }) => {
  const { setModalAlert } = use(ModalContext)

  const displayPendingEditAlert = useCallback(() => {
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
      Content: createAlertContentPendingEdit(),
      Choices: createAlertButtons({
        choices: [REJECT, DEFER, ACCEPT],
        colors: ["cancel", "main", "clean"],
        onChoice,
      }),
    })
  }, [conceptName, setModalAlert])

  return displayPendingEditAlert
}

export default useDisplayPendingEditAlert
