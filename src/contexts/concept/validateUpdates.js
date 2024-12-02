import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

import { isEmpty, prune } from "@/lib/util"

const validateUpdates = async (concept, updates, config) => {
  const { error: adminError } = validateAdminUpdates(updates)
  if (adminError) return { error: adminError }

  const { error: nameError } = await validateNameUpdate(
    concept,
    updates,
    config
  )
  if (nameError) return { error: nameError }

  return { error: null }
}

const validateAdminUpdates = updates => {
  // if (isAdmin()) return { error: null }

  const { name, rankLevel, rankName } = updates
  const needsAdmin = prune({ name, rankLevel, rankName })
  if (!isEmpty(needsAdmin)) {
    return {
      error: {
        type: "warning",
        message: "Request requires Admin role",
        title: "Unauthorized",
      },
    }
  }

  return { error: null }
}

const validateNameUpdate = async (concept, updates, config) => {
  if (!updates.name) return { error: null }

  // CxTBD
  // const { error: linkTemplatesError, payload: linkTemplates } =
  const linkTemplates = await fetchLinkTemplates(concept.name, config)
  // if (linkTemplatesError) return { error: linkTemplatesError }

  const nLinkRealizations = concept.linkRealizations.length
  const nLinkTemplates = linkTemplates.length

  const details = JSON.stringify({
    linkRealizations: nLinkRealizations,
    linkTemplates: nLinkTemplates,
  })

  // if (0 < nLinkRealizations || 0 < nLinkTemplates) {
  return {
    error: {
      details: details,
      type: "confirm",
      message: `Are you sure you want to update concept name to ${updates.name}?`,
      title: "CxDebug: Confirm",
    },
  }
  // }

  // return { error: null }
}

export { validateUpdates }
