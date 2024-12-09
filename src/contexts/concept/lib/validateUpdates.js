import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

import { isAdmin } from "@/lib/services/oni/auth/validate"
import { prune } from "@/lib/util"

const REMOVAL_VALUE = "REMOVE"

const rankLevelNameValue = value => (value !== REMOVAL_VALUE ? value : "")

const validateUpdates = async (
  concept,
  updates,
  config,
  setModalAlert,
  updateConcept
) => {
  const { alert: adminAlert } = validateRankLevelUpdates(
    concept,
    updates,
    setModalAlert,
    updateConcept
  )
  if (adminAlert) return { alert: adminAlert }

  const { alert: nameAlert } = await validateNameUpdate(
    concept,
    updates,
    config
  )
  if (nameAlert) return { alert: nameAlert }

  return { alert: null }
}

const validateRankLevelUpdates = (
  concept,
  updates,
  setModalAlert,
  updateConcept
) => {
  if (
    (updates.rankLevel === REMOVAL_VALUE ||
      updates.rankName === REMOVAL_VALUE) &&
    !isAdmin()
  ) {
    const onClose = () => {
      if (updates.rankLevel === REMOVAL_VALUE) {
        updateConcept({ rankLevel: concept.rankLevel })
      }
      if (updates.rankName === REMOVAL_VALUE) {
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

const validateNameUpdate = async (concept, updates, config) => {
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
        console.log("Choice:", choice)
      },
      title: "Confirm Concept Name Change",
      type: "confirm",
    },
  }
  // }
}

export { rankLevelNameValue, REMOVAL_VALUE, validateUpdates }
