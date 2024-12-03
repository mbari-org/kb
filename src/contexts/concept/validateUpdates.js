import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

import { isAdmin } from "@/lib/services/oni/auth/validate"
import { prune } from "@/lib/util"

const REMOVAL_VALUE = "REMOVE"

const rankLevelNameValue = value => (value !== REMOVAL_VALUE ? value : "")

const validateUpdates = async (concept, updates, config) => {
  const { alert: adminAlert } = validateRankLevelUpdates(updates)
  if (adminAlert) return { alert: adminAlert }

  const { alert: nameAlert } = await validateNameUpdate(
    concept,
    updates,
    config
  )
  if (nameAlert) return { alert: nameAlert }

  return { alert: null }
}

const validateRankLevelUpdates = updates => {
  if (
    (updates.rankLevel === REMOVAL_VALUE ||
      updates.rankName === REMOVAL_VALUE) &&
    !isAdmin()
  ) {
    const lnUpdates = prune({
      rankLevel: rankLevelNameValue(updates.rankLevel),
      rankName: rankLevelNameValue(updates.rankName),
    })
    return {
      alert: {
        detail: JSON.stringify(lnUpdates),
        message: "Removing rank level and/or name requires admin role",
        title: "Update Error",
        type: "warning",
      },
    }
  }
  return { alert: null }
}

const validateNameUpdate = async (concept, updates, config) => {
  if (!updates.name) return { error: null }

  // CxTBD
  // const { error: linkTemplatesError, payload: linkTemplates } =
  // if (linkTemplatesError) return { error: linkTemplatesError }
  const linkTemplates = await fetchLinkTemplates(concept.name, config)

  const nLinkRealizations = concept.linkRealizations.length
  const nLinkTemplates = linkTemplates.length

  const detail = JSON.stringify({
    linkRealizations: nLinkRealizations,
    linkTemplates: nLinkTemplates,
  })

  // if (0 < nLinkRealizations || 0 < nLinkTemplates) {
  return {
    alert: {
      detail: detail,
      type: "confirm",
      message: `Are you sure you want to update concept name to ${updates.name}?`,
      title: "CxDebug: Confirm",
    },
  }
  // }

  // return { alert: null }
}

export { rankLevelNameValue, REMOVAL_VALUE, validateUpdates }
