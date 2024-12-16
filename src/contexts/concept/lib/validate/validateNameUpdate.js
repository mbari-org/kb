import {
  createAlertChoices,
  createAlertConceptNameMessage,
  createAlertTitle,
} from "@/components/modals/alert/components"

import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

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
  const onChoice = async choice => {
    switch (choice) {
      case "Cancel":
        updateConcept({ name: concept.name })
        break
      case "Name Only":
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

export default validateNameUpdate
