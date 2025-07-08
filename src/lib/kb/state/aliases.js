import { CONCEPT_STATE } from '@/lib/constants'

import { stagedAlias } from '@/lib/kb/model/alias'

const aliasesState = (concept, pending) => {
  const { aliases: conceptAliases } = concept
  if (!conceptAliases) {
    return []
  }

  const aliases = conceptAliases.map((alias, index) =>
    stagedAlias({ ...alias, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )

  return { aliases }
}

const addAlias = (state, update) => {
  const alias = {
    ...update.alias,
    action: CONCEPT_STATE.ALIAS.ADD,
    index: state.aliases.length,
  }
  return {
    ...state,
    aliases: [...state.aliases, alias],
  }
}

const deleteAlias = (state, update) => {
  const aliasItem = state.aliases[update.aliasIndex]
  // If alias is an add, just remove it from state
  if (aliasItem?.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedAliases = state.aliases.filter((_item, index) => index !== update.aliasIndex)
    return {
      ...state,
      aliases: updatedAliases,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.ALIAS.DELETE, update })
}

const editAlias = (state, update) => {
  const aliasItem = state.aliases[update.aliasIndex]
  // If editing an added alias, don't change the action
  if (aliasItem.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedItem = {
      ...update.aliasItem,
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
  const { aliasItem, aliasIndex } = update
  if (aliasItem) {
    return {
      ...state,
      aliases: state.aliases.map((item, index) => (index === aliasIndex ? aliasItem : item)),
    }
  }
  return {
    ...state,
    aliases: state.aliases.filter((_item, index) => index !== aliasIndex),
  }
}

const resetAliases = (state, update) => {
  return {
    ...state,
    aliases: update.aliases,
  }
}

const updateState = (state, { type, update }) => {
  const { aliasIndex, aliasItem } = update
  const updatedItem = { ...state.aliases[aliasIndex], ...aliasItem, action: type }
  return {
    ...state,
    aliases: state.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item)),
  }
}

export { addAlias, aliasesState, deleteAlias, editAlias, isEmptyAlias, resetAlias, resetAliases }
