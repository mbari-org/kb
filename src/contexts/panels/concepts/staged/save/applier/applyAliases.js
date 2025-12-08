import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const applyAliases = (concept, tracker) => {
  const addAlias = alias => {
    concept.aliases = [...concept.aliases, alias]
    concept.alternateNames = [...concept.alternateNames, alias.name]
  }

  const deleteAlias = name => {
    concept.aliases = concept.aliases.filter(alias => alias.name !== name)
    concept.alternateNames = concept.alternateNames.filter(alternateName => alternateName !== name)
  }

  const editAlias = (priorName, updates) => {
    const index = concept.aliases.findIndex(alias => alias.name === priorName)
    if (index >= 0) {
      const prior = concept.aliases[index]
      const nextName = updates.newName ?? prior.name
      const next = { ...prior, ...updates }
      if (updates.newName) {
        next.name = updates.newName
        concept.alternateNames = concept.alternateNames
          .filter(alternateName => alternateName !== prior.name)
          .concat(nextName)
      }
      concept.aliases = concept.aliases.toSpliced(index, 1, next)
    }
  }

  switch (tracker.action) {
    case CONCEPT_STATE.ALIAS.ADD: {
      const payload = tracker.response?.payload
      payload?.name
        ? addAlias({
            id: payload.id,
            author: payload.author,
            name: payload.name,
            nameType: payload.nameType,
          })
        : addAlias({
            author: tracker.update.author,
            name: tracker.update.name,
            nameType: tracker.update.nameType,
          })
      break
    }

    case CONCEPT_STATE.ALIAS.DELETE: {
      if (tracker.isAdmin) {
        deleteAlias(tracker.params)
      }
      break
    }

    case CONCEPT_STATE.ALIAS.EDIT: {
      const [priorName, updates] = tracker.params
      editAlias(priorName, updates)
      break
    }

    default:
      break
  }
}

export default applyAliases
