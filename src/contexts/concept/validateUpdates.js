import { isAdmin } from "@/lib/services/oni/auth/validate"
import { isEmpty, prune } from "@/lib/util"

const validateUpdates = async (concept, updates, config) => {
  const { error: adminError } = validateIfAdminNeeded(updates)
  if (adminError) return { error: adminError }

  // const { author, name, media, rankLevel, rankName } = updates

  return {
    error: {
      level: "confirm",
      message: "Are you sure you want to update?",
      title: "CxDebug: Unauthorized",
    },
  }

  // return { error: null }
}

const validateIfAdminNeeded = updates => {
  if (isAdmin()) return { error: null }

  const { name, rankLevel, rankName } = updates
  const needsAdmin = prune({ name, rankLevel, rankName })
  if (!isEmpty(needsAdmin)) {
    return {
      error: {
        level: "warning",
        message: "Request requires Admin role",
        title: "Unauthorized",
      },
    }
  }

  return { error: null }
}

const validateConceptNameChange = async (concept, updates, config) => {
  return
}

export { validateUpdates }
