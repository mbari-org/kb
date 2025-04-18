import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const aliasesState = concept => {
  const { aliases: conceptAliases } = concept
  if (!conceptAliases) {
    return []
  }

  const aliases = conceptAliases.map(alias => ({
    ...alias,
    action: CONCEPT_STATE.NO_ACTION,
  }))

  return {
    aliases,
  }
}

const addAlias = (state, update) => {
  const alias = {
    ...update.alias,
    action: CONCEPT_STATE.ALIAS.ADD,
  }
  return {
    ...state,
    aliases: [...state.aliases, alias],
  }
}

const deleteAlias = (state, update) => {
  const alias = state.aliases[update.aliasIndex]
  // If alias is an add, just remove it from state
  if (alias.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedAliases = state.aliases.filter((_item, index) => index !== update.aliasIndex)
    return {
      ...state,
      aliases: updatedAliases,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.ALIAS.DELETE, update })
}

const editAlias = (state, update) => {
  const alias = state.aliases[update.aliasIndex]
  // If editing an added alias, don't change the action
  if (alias.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedItem = {
      ...update.alias,
      action: CONCEPT_STATE.ALIAS.ADD,
    }
    return {
      ...state,
      aliases: state.aliases.map((item, index) =>
        index === update.aliasIndex ? updatedItem : item
      ),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.ALIAS.EDIT, update })
}

const isEmptyAlias = alias => {
  return !alias.name && !alias.author && !alias.nameType
}

const resetAlias = (state, update) => {
  const { alias, aliasIndex } = update
  return {
    ...state,
    aliases: state.aliases.map((item, index) => (index === aliasIndex ? alias : item)),
  }
}

const resetAliases = (state, update) => {
  return {
    ...state,
    aliases: update.aliases,
  }
}

const updateState = (state, { type, update }) => {
  const { aliasIndex, alias } = update
  const updatedItem = { ...state.aliases[aliasIndex], ...alias, action: type }
  return {
    ...state,
    aliases: state.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item)),
  }
}

export { addAlias, aliasesState, deleteAlias, editAlias, isEmptyAlias, resetAlias, resetAliases }
