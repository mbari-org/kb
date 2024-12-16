import {
  createAlertChoices,
  createAlertConceptNameMessage,
  createAlertTextMessage,
  createAlertTitle,
} from "@/components/modals/alert/components"

import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

import { isAdmin } from "@/lib/services/oni/auth/validate"

const REMOVE_RANK_NAME_VALUE = "REMOVE"

const rankLevelNameValue = value =>
  value !== REMOVE_RANK_NAME_VALUE ? value : ""

const validateUpdates = async updatesObject => {
  const { alert: adminAlert } = validateRankLevelUpdates(updatesObject)
  if (adminAlert) return { alert: adminAlert }

  const { alert: nameAlert } = await validateNameUpdate(updatesObject)
  if (nameAlert) return { alert: nameAlert }

  return { alert: null }
}

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

const validateNameUpdate = async ({
  concept,
  config,
  setModalAlert,
  updates,
  updateConcept,
}) => {
  if (!updates.name) return { alert: null }

  const { payload: linkTemplates } = await fetchLinkTemplates(
    concept.name,
    config
  )

  const nLinkRealizations = concept.linkRealizations.length
  const nLinkTemplates = linkTemplates.length

  const choices = ["Cancel", "Name Only", "All Data"]
  const onChoice = choice => {
    switch (choice) {
      case "Cancel":
        updateConcept({ name: concept.name })
        // cancelChanges()
        break
      case "Name Only":
        console.log("Handle Name Only")
        break
      case "All Data":
        console.log("Handle All data")
        break
      default:
        break
    }

    setModalAlert(null)
  }

  return {
    alert: {
      Title: createAlertTitle({
        title: "Update Concept Name",
        type: "confirm",
      }),
      Message: createAlertConceptNameMessage({
        from: concept.name,
        to: updates.name,
      }),
      Choices: createAlertChoices({ choices, onChoice }),
    },
  }
}

export { rankLevelNameValue, REMOVE_RANK_NAME_VALUE, validateUpdates }
