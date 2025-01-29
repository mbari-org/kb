import {
  createActions,
  createTextContent,
  createTitle,
} from "@/components/kb/factory"

import { isAdmin } from "@/lib/auth/role"

const validateRankUpdates = async ({
  concept,
  modifyConcept,
  ranks,
  setAlert,
  updates,
  user,
}) => {
  const rank = {
    level: updates.rankLevel || concept.rankLevel,
    name: updates.rankName || concept.rankName,
  }

  // Check if the rank object is in ranks
  const rankExists = ranks.some(
    r => r.level === rank.level && r.name === rank.name
  )
  if (!rankExists) {
    return {
      rankLevel: false,
      rankName: false,
    }
  }

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
    setAlert(null)
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

  setAlert({
    Title: createTitle({
      title: "Update Rank/Level Error",
    }),
    Content: createTextContent({ sx: { mt: 4, mb: 6 }, text }),
    Actions: createActions({
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
