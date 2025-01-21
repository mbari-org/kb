import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
} from "@/components/modals/alert/components"

import { isAdmin } from "@/lib/auth/role"

const validateRankUpdates = async ({
  concept,
  modifyConcept,
  setModalAlert,
  updates,
  user,
}) => {
  let validation = {
    rankLevel: true,
    rankName: true,
  }

  if (isAdmin(user)) {
    return validation
  }

  const removeLevel = updates.rankLevel === ""
  const removeName = updates.rankName === ""

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
      modifyConcept({ rankLevel: concept.rankLevel })
      validation = { ...validation, rankLevel: false }
    }
    if (removeName) {
      modifyConcept({ rankName: concept.rankName })
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
    }),
    Content: createAlertContentText({ sx: { mt: 4, mb: 6 }, text }),
    Actions: createAlertButtons({
      choices,
      colors: ["cancel"],
      onChoice,
    }),
  })

  return promise
}

const validateUpdates = async updatesObject => {
  let rankValidation = await validateRankUpdates(updatesObject)

  return {
    author: true,
    ...rankValidation,
  }
}

export default validateUpdates
