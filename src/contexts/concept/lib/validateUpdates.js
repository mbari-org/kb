import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

import { isAdmin } from "@/lib/services/oni/auth/validate"
import { prune } from "@/lib/util"

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
  if (
    (updates.rankLevel === REMOVE_RANK_NAME_VALUE ||
      updates.rankName === REMOVE_RANK_NAME_VALUE) &&
    !isAdmin()
  ) {
    const onClose = () => {
      if (updates.rankLevel === REMOVE_RANK_NAME_VALUE) {
        updateConcept({ rankLevel: concept.rankLevel })
      }
      if (updates.rankName === REMOVE_RANK_NAME_VALUE) {
        updateConcept({ rankName: concept.rankName })
      }
      setModalAlert(null)
    }

    const lnUpdates = prune({
      rankLevel: rankLevelNameValue(updates.rankLevel),
      rankName: rankLevelNameValue(updates.rankName),
    })
    return {
      alert: {
        detail: JSON.stringify(lnUpdates),
        message: "Removing rank level and/or name requires admin role",
        onClose,
        title: "Update Error",
        type: "warning",
      },
    }
  }
  return { alert: null }
}

const validateNameUpdate = async ({
  cancelChanges,
  concept,
  config,
  setModalAlert,
  updates,
}) => {
  if (!updates.name) return { alert: null }

  const { payload: linkTemplates } = await fetchLinkTemplates(
    concept.name,
    config
  )

  const nLinkRealizations = concept.linkRealizations.length
  const nLinkTemplates = linkTemplates.length

  const detail = JSON.stringify({
    linkRealizations: nLinkRealizations,
    linkTemplates: nLinkTemplates,
  })

  return {
    alert: {
      choices: ["Cancel", "Name Only", "All Data"],
      detail,
      message: `Are you sure you want to update concept name '${concept.name}' to '${updates.name}'?`,
      onChoice: choice => {
        switch (choice) {
          case "Cancel":
            cancelChanges()
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
      },
      title: "Confirm Concept Name Change",
      type: "confirm",
    },
  }
}

export { rankLevelNameValue, REMOVE_RANK_NAME_VALUE, validateUpdates }
