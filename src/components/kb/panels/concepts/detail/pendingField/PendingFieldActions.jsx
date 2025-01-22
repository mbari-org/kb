import { use } from "react"

import { createActions } from "@/components/factory"

import ConfigContext from "@/contexts/config/ConfigContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { sendPendingAction } from "@/lib/services/oni/api/history"

const APPROVE = "Approve"
const DEFER = "Defer"
const REJECT = "Reject"

const PendingFieldActions = () => {
  const { config } = use(ConfigContext)
  const { setAlert } = use(ModalContext)

  const colors = ["cancel", "main", "clean"]
  const labels = [REJECT, DEFER, APPROVE]

  const fieldPendingHistory = { id: "CxInc ID" }

  const onAction = label => {
    switch (label) {
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

  return createActions({ colors, labels, onAction }, "PendingFieldActions")
}

export default PendingFieldActions
