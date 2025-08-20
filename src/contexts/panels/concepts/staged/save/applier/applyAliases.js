import { CONCEPT_STATE } from '@/lib/constants'

const applyAliases = (concept, tracker) => {
  const addAlias = alias => {
    concept.aliases = [...concept.aliases, alias]
    concept.alternateNames = [...concept.alternateNames, alias.name]
  }
  const editAlias = (priorName, updates) => {
    const idx = concept.aliases.findIndex(a => a.name === priorName)
    if (idx >= 0) {
      const prior = concept.aliases[idx]
      const nextName = updates.newName ?? prior.name
      const next = { ...prior, ...updates }
      if (updates.newName) {
        next.name = updates.newName
        concept.alternateNames = concept.alternateNames
          .filter(n => n !== prior.name)
          .concat(nextName)
      }
      concept.aliases = concept.aliases.toSpliced(idx, 1, next)
    }
  }
  const deleteAlias = name => {
    concept.aliases = concept.aliases.filter(a => a.name !== name)
    concept.alternateNames = concept.alternateNames.filter(n => n !== name)
  }

  switch (tracker.action) {
    case CONCEPT_STATE.ALIAS.ADD: {
      const payload = tracker.response?.payload
      if (payload?.name) {
        addAlias({ id: payload.id, author: payload.author, name: payload.name, nameType: payload.nameType })
      } else {
        const alias = {
          author: tracker.update.author,
          name: tracker.update.name,
          nameType: tracker.update.nameType,
        }
        addAlias(alias)
      }
      break
    }
    case CONCEPT_STATE.ALIAS.EDIT: {
      const [priorName, updates] = tracker.params
      editAlias(priorName, updates)
      break
    }
    case CONCEPT_STATE.ALIAS.DELETE: {
      deleteAlias(tracker.params)
      break
    }
    default:
      break
  }
}

export default applyAliases
