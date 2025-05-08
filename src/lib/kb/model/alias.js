import { CONCEPT_NAME_TYPES } from '@/lib/constants'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import { fieldEdits } from '@/lib/kb/model/field'

import { fieldPendingHistory } from './history'

import { isJsonEqual, pick } from '@/lib/util'

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

const aliasEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.ALIAS,
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial,
    staged,
  })

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

const stagedAlias = (alias, index, pendingHistory) => {
  const staged = {
    ...alias,
    index,
  }

  const pendingAliasActions = fieldPendingHistory(pendingHistory, 'ConceptName')

  const pendingAdd = pendingAliasActions.find(
    history => history.action === 'ADD' && history.newValue === alias.name
  )
  if (pendingAdd) {
    return {
      ...staged,
      action: 'PENDING ADD',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingAliasActions.find(
    history => history.action === 'DELETE' && history.oldValue === alias.name
  )
  if (pendingDelete) {
    return {
      ...staged,
      action: 'PENDING DELETE',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingAliasActions.find(
    history => history.action === 'EDIT' && history.newValue === alias.name
  )
  if (pendingEdit) {
    return {
      ...staged,
      action: 'PENDING EDIT',
      historyId: pendingEdit.id,
    }
  }

  return staged
}

export { ALIAS_TYPES, aliasEdits, aliasesEqual, aliasFields, EMPTY_ALIAS, stagedAlias }
