import { ACTION, CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants'
import { stagedEdits } from '@/lib/kb/state/staged'

import { orderedAliases } from '@/lib/kb/model/aliases'

import { drop } from '@/lib/utils'

const ALIAS_FIELDS = ['id', 'name', 'nameType', 'author']

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

const aliasState = (alias, pendingAliases) => {
  const pendingAlias = pendingAliases.find(pendingAlias => isMatching(alias, pendingAlias))
  if (pendingAlias) {
    return {
      ...alias,
      action: pendingAlias.action + ' Pending',
      historyId: pendingAlias.id,
    }
  }
  return { ...alias, action: CONCEPT_STATE.NO_ACTION }
}

const aliasesState = (concept, pendingConcept) => {
  const pendingAliases = pendingConcept.filter(isPendingAlias)
  const stagedAliases = concept.aliases.map((alias, index) =>
    aliasState({ ...alias, index }, pendingAliases)
  )
  return { aliases: orderedAliases(stagedAliases) }
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

const isMatching = (alias, pendingAlias) => {
  const pendingAliasValue =
    pendingAlias.action === ACTION.DELETE ? pendingAlias.oldValue : pendingAlias.newValue
  return pendingAliasValue === alias.name
}

const isPendingAlias = pendingItem =>
  pendingItem.field === HISTORY_FIELD.ALIAS &&
  !(pendingItem.action === ACTION.EDIT && pendingItem.concept === pendingItem.newValue)

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

const stagedAliasesEdits = stagedEdit => {
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

export {
  addAlias,
  aliasesState,
  deleteAlias,
  editAlias,
  isPendingAlias,
  resetAliases,
  stagedAliasesEdits,
}
