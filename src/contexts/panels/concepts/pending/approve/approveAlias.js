import { ACTION } from '@/lib/constants'

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
      throw new Error(`Invalid approval pending alias action: ${item.action}`)
  }
  concept.alternateNames = (concept.aliases || []).map(a => a.name).sort()
}

export default approveAlias
