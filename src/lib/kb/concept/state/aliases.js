import { NAME_TYPES } from '@/lib/kb/concept/aliases'
import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

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
    aliasIndex: 0,
  }
}

const addAlias = state => {
  const addItem = {
    author: '',
    name: '',
    nameType: NAME_TYPES.COMMON,
    action: CONCEPT_STATE.ALIAS.ADD,
  }
  return {
    ...state,
    aliases: [...state.aliases, addItem],
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
  if (update.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedItem = {
      ...alias,
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

const updateState = (state, { type, update }) => {
  const { aliasIndex, alias } = update
  const updatedItem = { ...state.aliases[aliasIndex], ...alias, action: type }
  return {
    ...state,
    aliases: state.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item)),
  }
}

export { addAlias, aliasesState, deleteAlias, editAlias, isEmptyAlias }
