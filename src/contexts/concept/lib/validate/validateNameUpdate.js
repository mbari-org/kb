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
  let validation = {
    name: "noop",
  }

  if (!updates.name) {
    return validation
  }

  const { payload: linkTemplates } = await fetchLinkTemplates(
    concept.name,
    config
  )

  const nLinkRealizations = concept.linkRealizations.length
  const nLinkTemplates = linkTemplates.length

  let resolvePromise
  const promise = new Promise(resolve => {
    resolvePromise = resolve
  })

  const choices = ["Cancel", "Name Only", "All Data"]
  const onChoice = async choice => {
    switch (choice) {
      case "Cancel":
        validation = { name: "cancel" }
        break
      case "Name Only":
        validation = { name: "solo" }
        break
      case "All Data":
        validation = { name: "all" }
        break
      default:
        break
    }
    setModalAlert(null)
    resolvePromise(validation)
  }

  setModalAlert({
    Title: createAlertTitle({
      title: "Update Concept Name",
      type: "confirm",
    }),
    Content: createAlertConceptNameMessage({
      from: concept.name,
      to: updates.name,
    }),
    Choices: createAlertChoices({ choices, onChoice }),
  })

  return promise
}

export default validateNameUpdate
