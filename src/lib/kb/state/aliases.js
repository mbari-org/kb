import { ACTION, CONCEPT_STATE } from '@/lib/constants'
import { fieldPending } from '@/lib/kb/model/history'
import { stagedEdits } from '@/lib/kb/state/staged'

import { drop } from '@/lib/utils'

const ALIAS_FIELDS = ['id', 'author', 'name', 'nameType']

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

const aliasesState = (concept, pending) => {
  const { aliases } = concept
  const stagedAliases = aliases.map((alias, index) =>
    stagedAlias({ ...alias, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )
  return { aliases: stagedAliases }
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

const resetAliases = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.aliases.length && resetIndex !== undefined) {
    const alias = update.aliases[resetIndex]
    return {
      ...state,
      aliases: state.aliases.reduce((acc, item, index) => {
        index === resetIndex ? alias != null && acc.push(alias) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...state,
    aliases: update.aliases,
  }
}

const stagedAlias = (alias, pendingConcept) => {
  const pendingHistories = fieldPending(pendingConcept, 'ConceptName')

  for (const verb of [ACTION.ADD, ACTION.DELETE, ACTION.EDIT]) {
    const pendingItem = pendingHistories.find(history => {
      const historyValue = verb === ACTION.DELETE ? history.oldValue : history.newValue
      return history.action === verb && historyValue === alias.name
    })
    if (pendingItem) {
      return {
        ...alias,
        action: verb + ' Pending',
        historyId: pendingItem.id,
      }
    }
  }

  return alias
}

const stagedAliases = stagedEdit => {
  const [_field, aliases] = stagedEdit

  return stagedEdits({
    displayFields: drop(ALIAS_FIELDS, ['id']),
    initial: aliases.initial,
    staged: aliases.staged,
    stateTypes: CONCEPT_STATE.ALIAS,
  })
}

const updateAlias = (state, { type, update }) => {
  const { aliasIndex, aliasItem } = update
  const updatedItem = { ...state.aliases[aliasIndex], ...aliasItem, action: type }
  const aliases = state.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item))
  return { ...state, aliases }
}

export { addAlias, aliasesState, deleteAlias, editAlias, resetAliases, stagedAlias, stagedAliases }
