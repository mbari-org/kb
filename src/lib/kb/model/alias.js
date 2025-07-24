import { stagedEdits } from '@/lib/kb/state/staged'

import { fieldPending } from './history'

import { isJsonEqual, pick } from '@/lib/utils'

import { CONCEPT_NAME_TYPES, CONCEPT_STATE } from '@/lib/constants'

const ALIAS_FIELDS = ['id', 'author', 'name', 'nameType']

// Prescribed order of types
const ALIAS_TYPES = [
  CONCEPT_NAME_TYPES.COMMON,
  CONCEPT_NAME_TYPES.SYNONYM,
  CONCEPT_NAME_TYPES.FORMER,
]

const EMPTY_ALIAS = {
  author: '',
  name: '',
  nameType: ALIAS_TYPES[0],
}

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const stagedAliases = stagedEdit => {
  const [_field, aliases] = stagedEdit

  return stagedEdits({
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial: aliases.initial,
    staged: aliases.staged,
    stateTypes: CONCEPT_STATE.ALIAS,
  })
}

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

const stagedAlias = (aliasItem, conceptPending) => {
  const pendingAliasActions = fieldPending(conceptPending, 'ConceptName')

  const pendingAdd = pendingAliasActions.find(
    history => history.action === 'ADD' && history.newValue === aliasItem.name
  )
  if (pendingAdd) {
    return {
      ...aliasItem,
      action: 'Pending Add',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingAliasActions.find(
    history => history.action === 'DELETE' && history.oldValue === aliasItem.name
  )
  if (pendingDelete) {
    return {
      ...aliasItem,
      action: 'Pending Delete',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingAliasActions.find(
    history => history.action === 'REPLACE' && history.newValue === aliasItem.name
  )
  if (pendingEdit) {
    return {
      ...aliasItem,
      action: 'Pending Edit',
      historyId: pendingEdit.id,
    }
  }

  return aliasItem
}

export { ALIAS_TYPES, aliasesEqual, aliasFields, EMPTY_ALIAS, stagedAlias, stagedAliases }
