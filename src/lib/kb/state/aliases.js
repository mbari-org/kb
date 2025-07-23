import { CONCEPT_STATE } from '@/lib/constants'

import { stagedAlias } from '@/lib/kb/model/alias'

const aliasesState = (concept, pending) => {
  const { aliases } = concept
  const stagedAliases = aliases.map((alias, index) =>
    stagedAlias({ ...alias, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )
  return { aliases: stagedAliases }
}

const addAlias = (state, update) => {
  const aliasIndex = state.aliases.length
  const aliasItem = {
    ...update.aliasItem,
    action: CONCEPT_STATE.ALIAS.ADD,
    index: aliasIndex,
  }
  return {
    ...state,
    aliases: [...state.aliases, aliasItem],
    aliasIndex,
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
  return updateAlias(state, { type: CONCEPT_STATE.ALIAS.DELETE, update })
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
  return updateAlias(state, { type: CONCEPT_STATE.ALIAS.EDIT, update })
}

const resetAlias = (state, update) => {
  const { aliasIndex, aliasItem } = update
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

const updateAlias = (state, { type, update }) => {
  const { aliasIndex, aliasItem } = update
  const updatedItem = { ...state.aliases[aliasIndex], ...aliasItem, action: type }
  const aliases = state.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item))
  return { ...state, aliases }
}

export { addAlias, aliasesState, deleteAlias, editAlias, resetAlias, resetAliases }
