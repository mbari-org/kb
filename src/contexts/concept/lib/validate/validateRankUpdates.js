import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
} from "@/components/modals/alert/components"

import { isAdmin } from "@/lib/services/oni/auth/validate"

import { REMOVE_RANK_NAME_VALUE } from "./validateUpdates"

const validateRankUpdates = async ({
  concept,
  setModalAlert,
  updates,
  updateConcept,
}) => {
  let validation = {
    rankLevel: true,
    rankName: true,
  }

  if (isAdmin()) {
    return validation
  }

  const removeLevel = updates.rankLevel === REMOVE_RANK_NAME_VALUE
  const removeName = updates.rankName === REMOVE_RANK_NAME_VALUE

  if (!(removeLevel || removeName)) {
    return validation
  }

  let resolvePromise
  const promise = new Promise(resolve => {
    resolvePromise = resolve
  })

  const choices = ["Continue"]
  const onChoice = _choice => {
    // Restore removed rank level and/or name
    if (removeLevel) {
      updateConcept({ rankLevel: concept.rankLevel })
      validation = { ...validation, rankLevel: false }
    }
    if (removeName) {
      updateConcept({ rankName: concept.rankName })
      validation = { ...validation, rankName: false }
    }
    setModalAlert(null)
    resolvePromise(validation)
  }

  let text
  if (removeLevel && removeName) {
    text = "Removing rank level and name requires admin role"
  } else if (removeLevel) {
    text = "Removing rank level requires admin role"
  } else {
    text = "Removing rank name requires admin role"
  }

  setModalAlert({
    Title: createAlertTitle({
      title: "Update Rank/Level Error",
      type: "warning",
    }),
    Content: createAlertContentText({ text }),
    Choices: createAlertButtons({ choices, onChoice }),
  })

  return promise
}

export default validateRankUpdates
