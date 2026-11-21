import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { nameIdFromResponse } from '@/lib/model/aliases'

const applyAliasResults = ({ concept, isAdmin, result }) => {
  const addAlias = alias => {
    concept.aliases = [...concept.aliases, alias]
    concept.alternateNames = [...concept.alternateNames, alias.name]
  }

  const deleteAlias = id => {
    const prior = concept.aliases.find(alias => alias.id === id)
    concept.aliases = concept.aliases.filter(alias => alias.id !== id)
    concept.alternateNames = concept.alternateNames.filter(alternateName => alternateName !== prior.name)
  }

  const editAlias = (id, updates) => {
    const index = concept.aliases.findIndex(alias => alias.id === id)
    const prior = concept.aliases[index]
    const { newName, ...fields } = updates
    const next = { ...prior, ...fields, name: newName ?? prior.name }
    if (newName) {
      concept.alternateNames = concept.alternateNames
        .filter(alternateName => alternateName !== prior.name)
        .concat(newName)
    }
    concept.aliases = concept.aliases.toSpliced(index, 1, next)
  }

  switch (result.action) {
    case CONCEPT_STATE.ALIAS.ADD: {
      addAlias({
        id: nameIdFromResponse(result.response, result.update.name),
        author: result.update.author,
        name: result.update.name,
        nameType: result.update.nameType,
      })
      break
    }

    case CONCEPT_STATE.ALIAS.DELETE: {
      if (isAdmin) {
        deleteAlias(result.params)
      }
      break
    }

    case CONCEPT_STATE.ALIAS.EDIT: {
      const [priorId, updates] = result.params
      editAlias(priorId, updates)
      break
    }

    default:
      break
  }
}

export default applyAliasResults
