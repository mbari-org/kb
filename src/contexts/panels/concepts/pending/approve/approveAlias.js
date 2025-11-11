import { ACTION } from '@/lib/constants/constants'
import { createError } from '@/lib/errors'

const approveAlias = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const exists = (concept.aliases || []).some(a => a.name === item.newValue)
      if (!exists) concept.aliases = [...(concept.aliases || []), { name: item.newValue }]
      break
    }

    case ACTION.DELETE: {
      concept.aliases = (concept.aliases || []).filter(a => a.name !== item.oldValue)
      break
    }

    case ACTION.EDIT: {
      concept.aliases = (concept.aliases || []).map(a =>
        a.name === item.oldValue ? { ...a, name: item.newValue } : a
      )
      break
    }

    default:
      throw createError(
        'Invalid Pending Action',
        `Cannot approve alias with invalid action: ${item.action}`,
        { item }
      )
  }
  concept.alternateNames = (concept.aliases || []).map(a => a.name).sort()
}

export default approveAlias
