import { ACTION } from '@/lib/constants'

const rejectAlias = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.aliases = concept.aliases.filter(alias => alias.name !== pendingItem.newValue)
      break
    }

    case ACTION.DELETE: {
      const exists = concept.aliases.some(alias => alias.name === pendingItem.oldValue)
      if (!exists) concept.aliases = [...concept.aliases, { name: pendingItem.oldValue }]
      break
    }

    case ACTION.EDIT: {
      concept.aliases = concept.aliases.map(alias =>
        alias.name === pendingItem.newValue ? { ...alias, name: pendingItem.oldValue } : alias
      )
      break
    }

    default:
      break
  }
  concept.alternateNames = concept.aliases.map(alias => alias.name).sort()
}

export default rejectAlias
