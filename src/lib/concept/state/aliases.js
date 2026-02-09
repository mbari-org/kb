import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { stagedEdits } from '@/lib/concept/state/staged'

import { orderedAliases } from '@/lib/model/aliases'

import { drop, isJsonEqual } from '@/lib/utils'

const ALIAS_FIELDS = ['id', 'name', 'nameType', 'author']

const addAlias = ({ stagedState, update }) => {
  const aliasIndex = stagedState.aliases.length
  const aliasItem = {
    ...update.aliasItem,
    action: CONCEPT_STATE.ALIAS.ADD,
    index: aliasIndex,
  }
  return {
    ...stagedState,
    aliases: [...stagedState.aliases, aliasItem],
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

const isModified = (initial, staged) => !isJsonEqual(initial?.aliases, staged?.aliases)

const deleteAlias = ({ stagedState, update }) => {
  const aliasItem = stagedState.aliases[update.aliasIndex]
  // If alias is an add, just remove it from state
  if (aliasItem?.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedAliases = stagedState.aliases.filter((_item, index) => index !== update.aliasIndex)
    return {
      ...stagedState,
      aliases: updatedAliases,
    }
  }
  return updateAlias({ stagedState, update, type: CONCEPT_STATE.ALIAS.DELETE })
}

const editAlias = ({ stagedState, update }) => {
  const aliasItem = stagedState.aliases[update.aliasIndex]
  // If editing an added alias, don't change the action
  if (aliasItem.action === CONCEPT_STATE.ALIAS.ADD) {
    const updatedItem = {
      ...update.aliasItem,
      action: CONCEPT_STATE.ALIAS.ADD,
    }
    return {
      ...stagedState,
      aliases: stagedState.aliases.map((item, index) =>
        index === update.aliasIndex ? updatedItem : item
      ),
    }
  }
  return updateAlias({ stagedState, update, type: CONCEPT_STATE.ALIAS.EDIT })
}

const isMatching = (alias, pendingAlias) => {
  const pendingAliasValue =
    pendingAlias.action === ACTION.DELETE ? pendingAlias.oldValue : pendingAlias.newValue
  return pendingAliasValue === alias.name
}

const isPendingAlias = pendingItem =>
  pendingItem.field === HISTORY_FIELD.ALIAS &&
  !(pendingItem.action === ACTION.EDIT && pendingItem.concept === pendingItem.newValue)

const resetAliases = ({ stagedState, update }) => {
  const { index: resetIndex } = update

  if (1 < stagedState.aliases.length && resetIndex !== undefined) {
    const alias = update.aliases[resetIndex]
    return {
      ...stagedState,
      aliases: stagedState.aliases.reduce((acc, item, index) => {
        index === resetIndex ? alias != null && acc.push(alias) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...stagedState,
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

const updateAlias = ({ stagedState, update, type }) => {
  const { aliasIndex, aliasItem } = update
  const updatedItem = { ...stagedState.aliases[aliasIndex], ...aliasItem, action: type }
  const aliases = stagedState.aliases.map((item, index) => (index === aliasIndex ? updatedItem : item))
  return { ...stagedState, aliases }
}

export {
  addAlias,
  aliasesState,
  deleteAlias,
  editAlias,
  isModified,
  isPendingAlias,
  resetAliases,
  stagedAliasesEdits,
}

