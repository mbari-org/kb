import {
  createAlertChoices,
  createAlertTextMessage,
  createAlertTitle,
} from "@/components/modals/alert/components"

import { isAdmin } from "@/lib/services/oni/auth/validate"

import { REMOVE_RANK_NAME_VALUE } from "./validateUpdates"

const validateRankLevelUpdates = ({
  concept,
  setModalAlert,
  updates,
  updateConcept,
}) => {
  const removeLevel = updates.rankLevel === REMOVE_RANK_NAME_VALUE
  const removeName = updates.rankName === REMOVE_RANK_NAME_VALUE
  if ((removeLevel || removeName) && isAdmin()) {
    const choices = ["OK"]
    const onChoice = _choice => {
      if (removeLevel) {
        updateConcept({ rankLevel: concept.rankLevel })
      }
      if (removeName) {
        updateConcept({ rankName: concept.rankName })
      }
      setModalAlert(null)
    }

    let text
    if (removeLevel && removeName) {
      text = "Removing rank level and name requires admin role"
    } else if (removeLevel) {
      text = "Removing rank level requires admin role"
    } else {
      text = "Removing rank name requires admin role"
    }

    return {
      alert: {
        Title: createAlertTitle({
          title: "Update Rank/Level Error",
          type: "warning",
        }),
        Message: createAlertTextMessage({ text }),
        Choices: createAlertChoices({ choices, onChoice }),
      },
    }
  }
  return { alert: null }
}

export default validateRankLevelUpdates
